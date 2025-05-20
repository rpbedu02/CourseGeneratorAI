// --- Common Utility Functions and Constants ---

// --- AI Providers Configuration ---
const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    models: [ { id: 'gpt-4o', name: 'GPT-4o (Latest)' }, { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' }, { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' } ],
    headers: (apiKey) => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }),
    formatRequest: (model, messages) => ({ model: model || 'gpt-4o', messages: messages, temperature: 0.7 }),
    extractResponse: (data) => data?.choices?.[0]?.message?.content || ''
  },
  groq: {
    name: 'Groq',
    apiEndpoint: 'https://api.groq.com/openai/v1/chat/completions',
    models: [ { id: 'gemma2-9b-it', name: 'Gemma2 9B (Google)' }, { id: 'llama-3.1-70b-versatile', name: 'LLaMA 3.1 70B' }, { id: 'llama-3.1-8b-instant', name: 'LLaMA 3.1 8B' }, { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7b' }, { id: 'llama3-groq-tool-use-alpha', name: 'LLaMA3 Tool Use (Alpha)'} ],
    headers: (apiKey) => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }),
    formatRequest: (model, messages) => ({ model: model || 'llama-3.1-70b-versatile', messages: messages, temperature: 0.7 }),
    extractResponse: (data) => data?.choices?.[0]?.message?.content || ''
  },
  anthropic: {
    name: 'Anthropic',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    models: [ { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' }, { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' }, { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' } ],
    headers: (apiKey) => ({ 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' }),
    formatRequest: (model, messages) => { const sys = messages.find(m=>m.role==='system')?.content||''; const user = messages.filter(m=>m.role!=='system'); return { model: model||'claude-3-sonnet-20240229', messages:user, system:sys, max_tokens:4000 }; },
    extractResponse: (data) => data?.content?.[0]?.text || ''
  },
  gemini: {
    name: 'Google Gemini',
    apiEndpoint: (apiKey, model) => `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash-latest'}:generateContent?key=${apiKey}`,
    models: [ { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro' }, { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash' } ],
    headers: () => ({ 'Content-Type': 'application/json' }),
    formatRequest: (model, messages) => { const sys = messages.find(m=>m.role==='system')?.content; const user = messages.find(m=>m.role==='user')?.content||''; const contents=[{role:"user",parts:[{text:user}]}]; const sysObj=sys?{parts:[{text:sys}]}:null; return {contents:contents, ...(sysObj && {systemInstruction: sysObj}), generationConfig:{temperature:0.7}}; },
    extractResponse: (data) => { if(data?.promptFeedback?.blockReason) throw new Error(`Gemini blocked: ${data.promptFeedback.blockReason}`); if(!data?.candidates?.length) { if(data?.promptFeedback?.safetyRatings?.some(r=>r.blocked)) throw new Error("Gemini blocked (safety)."); console.warn("Gemini no candidates.", data); return ''; } if(data.candidates[0]?.content?.parts?.[0]?.text) return data.candidates[0].content.parts.map(p=>p.text||'').join(''); if(data.candidates[0]?.finishReason&&data.candidates[0].finishReason!=='STOP') console.warn(`Gemini finish reason: ${data.candidates[0].finishReason}`); if(data?.error) throw new Error(`Gemini API error: ${data.error.message}`); console.error("Unexpected Gemini format:", data); return ''; }
  }
};

// --- Helper Functions ---

/**
 * Displays an alert message dynamically.
 * @param {string} message The message to display.
 * @param {'error'|'success'|'info'} type The type of alert.
 * @param {number} duration Duration in ms before auto-closing. 0 for no auto-close.
 */
function showAlert(message, type = 'error', duration = 5000) {
  // This function relies on 'elements.alertContainer' being available in the global scope of the calling HTML page.
  // Ensure each HTML page that uses this has an element with id="alert-container".
  const alertContainer = document.getElementById('alert-container');
  if (!alertContainer) {
    console.error("Alert container not found on this page. Cannot display alert:", message);
    return;
  }
  // On CourseGeneratorAI.html, alerts are appended, not prepended, and clear previous.
  // On other pages, they are prepended and multiple can exist.
  // For consistency, let's make it always clear previous and append one.
  // Or, stick to the behavior of each page if `elements` is page-specific.
  // Given this is common.js, a generic approach is better.
  // Let's assume the calling page's `elements.alertContainer` is the correct target.
  // The original CourseGeneratorAI.html showAlert clears and appends.
  // The original CourseContentAndProgress.html showAlert prepends.
  // The original CourseSavingAndExport.html showAlert prepends.

  // To make it truly common, it should not depend on a global `elements` object from the page.
  // It should take the container as an argument, or find it by a consistent ID.
  // Sticking with finding by ID "alert-container" as a convention.

  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.style.marginBottom = '0.5rem'; // Consistent styling
  alertDiv.innerHTML = `<div class="alert-content"><div class="alert-title">${type[0].toUpperCase() + type.slice(1)}</div><div class="alert-description">${message}</div></div>`;

  // Behavior adjustment:
  // - CourseGeneratorAI.html: clears container, then appends.
  // - Others: prepends, allowing multiple.
  // Let's make it consistently prepend to allow multiple, as that's the dominant pattern.
  // If CourseGeneratorAI.html *needs* to clear, its local showAlert wrapper can do that.
  // For common.js, we'll make it prepend.
  alertContainer.prepend(alertDiv); // Changed from appendChild for consistency with other pages

  if (duration > 0) {
    setTimeout(() => {
      // Check if the alertDiv is still a child of alertContainer before removing
      if (alertDiv.parentNode === alertContainer) {
        alertDiv.remove();
      }
    }, duration);
  }
}


/**
 * Safely parses a JSON string, attempting to clean it first.
 * Handles common AI issues like markdown code blocks.
 * @param {string} jsonString The JSON string to parse.
 * @returns {object} The parsed JavaScript object.
 * @throws {Error} If parsing fails after attempts.
 */
function safeJsonParse(jsonString) {
  // console.log for debugging can be kept if desired, or removed for cleaner common.js
  // console.log("Attempting to parse JSON (common.js):", jsonString);
  // updateDebugInfo is page-specific to CourseContentAndProgress, so it cannot be called here directly.
  // If logging is needed, common.js should use console.log or a passed-in logging function.

  if (typeof jsonString !== 'string' || !jsonString.trim()) {
    console.error("Invalid input for safeJsonParse: JSON string is empty or not a string.");
    throw new Error("Invalid input: JSON string empty/not string.");
  }
  try {
    // Attempt to clean common AI formatting issues (like ```json)
    const clean = jsonString.replace(/^```(?:json)?\s*|```\s*$/g, '').trim();
    // console.log("Cleaned JSON string (common.js):", clean);
    return JSON.parse(clean);
  } catch (parseError) {
    console.warn('Direct JSON parse failed (common.js):', parseError, '\nOriginal:', jsonString);
    // Attempt to extract JSON object from potentially malformed string
    const match = jsonString.match(/\{[\s\S]*\}/);
    if (match?.[0]) {
      // console.log("Attempting to parse extracted JSON (common.js):", match[0]);
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        console.error('Extracted JSON parse failed (common.js):', e, '\nOriginal:', jsonString);
        throw new Error(`Failed to parse AI response (common.js).`);
      }
    } else {
      console.error('No JSON object found in string (common.js):', jsonString);
      throw new Error(`Failed to parse AI response, no JSON object found (common.js).`);
    }
  }
}

/**
 * Makes an API request to the specified AI provider.
 * @param {string} provider The AI provider key (e.g., 'openai', 'groq').
 * @param {string} apiKey The API key for the provider.
 * @param {Array<object>} messages The array of messages for the chat completion.
 * @param {string} model The specific model ID to use.
 * @returns {Promise<string>} The extracted text content from the AI response.
 * @throws {Error} If the API request fails or the response is invalid.
 */
async function makeApiRequest(provider, apiKey, messages, model) {
  const providerConfig = AI_PROVIDERS[provider];
  if (!providerConfig) throw new Error(`Unsupported provider: ${provider}`);

  // Ensure a model is selected, defaulting to the first in the provider's list if not specified
  const selectedModel = model || providerConfig.models[0]?.id;
  if (!selectedModel) throw new Error(`No model selected or configured for provider ${provider}`);

  let apiEndpoint;
  try {
    if (typeof providerConfig.apiEndpoint === 'function') {
      apiEndpoint = providerConfig.apiEndpoint(apiKey, selectedModel);
    } else {
      apiEndpoint = providerConfig.apiEndpoint;
    }

    const headers = providerConfig.headers(apiKey);
    const requestBody = providerConfig.formatRequest(selectedModel, messages);

    console.log(`API Request (common.js): ${provider} (${selectedModel}) to ${apiEndpoint}`);
    // updateDebugInfo is page-specific, cannot call here.

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody)
    });

    console.log(`API Response Status (common.js): ${response.status}`);
    // updateDebugInfo is page-specific.

    if (!response.ok) {
      let errorText = `API error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorText = errorData?.error?.message || errorData?.message || errorText;
        console.error("API Error Body (common.js):", errorData);
      } catch (e) {
        try {
          errorText = (await response.text()) || errorText;
          console.error("API Error Text (common.js):", errorText);
        } catch (et) { /* ignore secondary error */ }
      }
      throw new Error(errorText);
    }

    const data = await response.json();
    const content = providerConfig.extractResponse(data);

    if (typeof content !== 'string') {
      console.error("Invalid content format from AI (common.js). Expected string, got:", typeof content, data);
      throw new Error("Invalid content format from AI (common.js).");
    }
    // updateDebugInfo is page-specific.
    return content;
  } catch (error) {
    console.error(`API request failed for ${provider} (common.js):`, error);
    // updateDebugInfo is page-specific.
    if (error.message.toLowerCase().includes('api key') || error.message.toLowerCase().includes('auth')) {
      throw new Error("Authentication failed. Check API key.");
    }
    if (error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('limit')) {
      throw new Error("API limit/quota reached.");
    }
    if (error.message.toLowerCase().includes("blocked")) {
      throw new Error("Request blocked by AI provider (Safety/Policy).");
    }
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // This can also be a CORS issue if the API endpoint isn't configured for client-side calls,
      // or a network connectivity problem.
      throw new Error("Network error or CORS issue. Check connection and API endpoint configuration.");
    }
    // Rethrow a more generic message or the specific one if it's not one of the above
    throw new Error(`API request error: ${error.message}`);
  }
}

/**
 * Escapes HTML special characters in a string.
 * @param {string | any} unsafe The string to escape. If not a string, it's converted.
 * @returns {string} The escaped string.
 */
function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') {
    try {
      unsafe = String(unsafe);
    } catch (e) {
      return ''; // Return empty string if conversion fails
    }
  }
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}