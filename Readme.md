# CourseGeneratorAI 🚀

CourseGeneratorAI is a client-side web application designed to help educators and students rapidly generate, refine, and export educational course content using various Large Language Models (LLMs).

**Live Demo:** [Link]

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running Locally](#running-locally)
- [Usage Guide](#usage-guide)
  - [1. Input Details](#1-input-details)
  - [2. Course Content & Progress](#2-course-content--progress)
  - [3. Saved Courses & Export](#3-saved-courses--export)
- [AI Providers](#ai-providers)
- [Key Functionality: Interactive HTML Export](#key-functionality-interactive-html-export)
- [Data Persistence](#data-persistence)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features

*   **AI-Powered Content Generation:**
    *   Generate course titles, descriptions, and summaries.
    *   Extract key topics and concepts from lecture notes or syllabi.
    *   Create full course structures including modules, lessons, learning objectives, activities, and resources.
*   **Multi-LLM Support:** Integrates with multiple AI providers:
    *   OpenAI
    *   Groq
    *   Anthropic
    *   Google Gemini
*   **Interactive Quiz Generation:** Create multiple-choice quizzes for lessons with AI assistance.
*   **Content Expansion:** Use AI to elaborate and expand on existing lesson content.
*   **Client-Side Operation:** Runs entirely in the user's browser. No backend server required.
*   **Local Data Persistence:** Saves user inputs, API configurations, and generated courses in the browser's `localStorage`.
*   **Interactive HTML Export:** Export complete courses as standalone, interactive HTML files. These exports include:
    *   Full course content and structure.
    *   Embedded CSS and JavaScript for interactivity (module toggling, quizzes).
    *   Lesson completion tracking and progress reporting (within the exported file's `localStorage`).
    *   A functional quiz engine.
*   **Responsive Design:** Adapts to various screen sizes.

## How It Works

The application guides users through a three-step process:

1.  **Input Details (`CourseGeneratorAI.html`):** Users provide lecture notes, select an AI provider/model, and enter their API key. AI assists in summarizing notes, extracting topics, and suggesting titles/descriptions. A full course structure is then generated.
2.  **Course Content & Progress (`CourseContentAndProgress.html`):** The generated course is displayed. Users can:
    *   View and navigate the course content (modules, lessons).
    *   Generate/regenerate quizzes for individual lessons.
    *   Expand content for individual lessons or all topics.
    *   Take quizzes in an interactive modal.
3.  **Saved Courses & Export (`CourseSavingAndExport.html`):** Users can:
    *   Save the current course to their browser's `localStorage`.
    *   Load previously saved courses.
    *   Export the current course as a self-contained, interactive HTML file.

## Tech Stack

*   **HTML5:** Structure
*   **CSS3:** Styling (common styles + page-specific)
*   **JavaScript (ES6+):** Application logic, DOM manipulation, API interactions.
*   **`localStorage`:** For client-side data storage.

## Getting Started

### Prerequisites

*   A modern web browser (Chrome, Firefox, Edge, Safari).
*   An API key for at least one of the supported AI providers (OpenAI, Groq, Anthropic, Google Gemini).

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/CourseGeneratorAI.git
    cd CourseGeneratorAI
    ```
2.  **Open `index.html`:**
    *   Navigate to the `CourseGeneratorAI` directory.
    *   Open the `index.html` file directly in your web browser. This file will redirect you to `CourseGeneratorAI/CourseGeneratorAI.html` to start the application.
    *   Alternatively, if you are serving the files from a local web server (e.g., using VS Code Live Server, Python's `http.server`, or Node.js `serve`), open the root URL in your browser.

## Usage Guide

### 1. Input Details

*   **AI Provider & Model:** Select your preferred AI service and model.
*   **API Key:** Enter your API key for the selected provider. *Note: API keys are stored in your browser's `localStorage` for convenience if you choose to revisit. They are not sent to any external server by this application, only directly to the chosen AI provider's API.*
*   **Course Title & Description:** Optionally provide these, or use the "Suggest Title & Description" button later.
*   **Lecture Notes:** Paste your raw course material (syllabus, notes, text).
*   **Helper Actions:**
    *   `Generate Summary`: Get a concise summary of your notes.
    *   `Extract Topics`: Let AI identify key topics, which you can then select.
    *   `Suggest Title & Description`: AI generates these based on your notes.
*   **Generate Course:**
    *   `Generate Course from Full Notes & View`: Creates a course structure from all provided inputs.
    *   `Generate Course from Selected Topics & View`: Creates a course based on the topics you selected after extraction.
    *   Upon successful generation, you'll be taken to the "Course Content & Progress" tab.

### 2. Course Content & Progress

*   **View Course:** Navigate through modules and lessons. Modules are collapsible. Use the Table of Contents for quick navigation.
*   **Lesson Actions:**
    *   `Start Quiz`: If a quiz exists for a lesson, click to take it in an interactive modal.
    *   `Generate/Regenerate Quiz`: (Requires API key) Create or update the quiz for the current lesson using AI.
    *   `Expand Content`: (Requires API key) Use AI to elaborate on the current lesson's content.
*   **Global Actions:**
    *   `Generate Quizzes`: (Requires API key) Attempts to generate quizzes for all lessons with sufficient content.
    *   `Expand All Topics`: (Requires API key) Attempts to expand content for all lessons.
    *   `Manage Save/Export`: Takes you to the next tab to save or export your current course.

### 3. Saved Courses & Export

*   **Manage Current Course:**
    *   `Save Current Course`: Saves the course you're working on (from the "Course Content" tab) to your browser's `localStorage`. You'll be prompted for a name.
    *   `Export Interactive HTML`: Creates a downloadable, self-contained HTML file of the current course.
*   **Previously Saved Courses:**
    *   Lists all courses you've saved.
    *   `Load & View`: Opens a saved course in the "Course Content & Progress" tab.
    *   `Delete`: Removes a saved course from your browser's storage.

## AI Providers

The application interfaces with the following AI providers. You are responsible for any costs associated with using their APIs.

*   **OpenAI:** `gpt-4o`, `gpt-4-turbo`, `gpt-3.5-turbo`
*   **Groq:** `gemma2-9b-it`, `llama-3.1-70b-versatile`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768`
*   **Anthropic:** `claude-3-opus`, `claude-3-sonnet`, `claude-3-haiku`
*   **Google Gemini:** `gemini-1.5-pro-latest`, `gemini-1.5-flash-latest`

The application attempts to send requests in the format expected by each provider and parse their responses.

## Key Functionality: Interactive HTML Export

One of the most powerful features is the ability to export a course as a single, interactive HTML file. This file:

*   Contains all course content, modules, and lessons.
*   Includes embedded CSS for styling and JavaScript for interactivity.
*   Allows users to navigate the course, expand/collapse modules.
*   Features a built-in quiz engine for any generated quizzes.
*   Tracks lesson completion via checkboxes.
*   Provides a "Your Progress" tab showing overall completion, module progress, and average quiz scores.
*   Saves progress *within that specific HTML file's context* using `localStorage`.
*   Allows printing or exporting a text-based progress report.

This makes the exported course highly portable and usable offline (after initial download) without needing any external dependencies or hosting platform.

## Data Persistence

CourseGeneratorAI uses your browser's `localStorage` to store:

*   API keys, selected provider, and model (`storedApiKey`, `storedProvider`, etc.).
*   Input fields from the "Input Details" tab (`storedCourseTitle`, `storedLectureNotes`, etc.).
*   Generated summaries and extracted topics (`storedSummary`, `storedTopics`).
*   The currently active course being viewed/edited (`courseToManage` or `pendingCourseData`).
*   A list of all saved courses (`savedCourses`).

Clearing your browser's site data for this application will remove all saved information.

## Contributing

If you have suggestions for improvements or bug fixes, please feel free to email them to rpbedu01@protonmail.com

## License

You can fork and use the app and the materials generated with it for personal use without licensing arrangements. For commercial use, contact rpbedu01@protonmail.com for licensing arrangements.

## Acknowledgements

*   This project relies on the APIs of OpenAI, Groq, Anthropic, and Google.

---

*Happy Course Generating!*
