# TawasolApp
This repository is the source code for the frontend of linkedin-clone

## Technology Stack
- React
- Javascript
- Vite
- Tailwind CSS
- Vitest

## Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)

## Setup
1. Clone the repository:
```bash
git clone <repository-url>
cd <project-folder>
```
2. Install dependencies:
```bash
npm install
```

## Running the Project
Start the development server:
```bash
npm run dev
```
Open your browser and navigate to http://localhost:5173.

## Testing
Run tests with Vitest:
```bash
npm run test
```

## Commit Format

Each commit message should follow this format:
`<type>: <description>`
- **`<type>`**: A keyword that describes the purpose of the commit (e.g., `feat`, `fix`, `docs`, etc.)
- **`<description>`**: A concise description of the changes

### Commit Types

Use the following types to categorize your commits:

| Type       | Description                                                                 |
|------------|-----------------------------------------------------------------------------|
| `feat`     | A new feature or functionality.                                             |
| `fix`      | A bug fix.                                                                  |
| `docs`     | Documentation changes (e.g., README, comments, or project documentation).   |
| `style`    | Code style changes (e.g., formatting, linting, or whitespace).              |
| `refactor` | Code changes that neither fix a bug nor add a feature (e.g., code cleanup). |
| `test`     | Adding or updating tests.                                                   |
| `chore`    | Routine tasks or maintenance (e.g., updating dependencies, config files).   |
| `build`    | Changes related to the build system or external dependencies.               |
| `perf`     | Performance improvements.                                                   |
| `revert`   | Reverting a previous commit.                                                |

## Project Directories Structure
```
FRONT-END/
├── src/                   # Main source code directory
│   ├── apis/              # API service files for backend/mock communication
│   ├── assets/            # Static assets like images, fonts, etc.
│   ├── layouts/           # Layout components for consistent page structure
│   ├── mocks/             # Mock data for development and testing
│   ├── pages/             # Page components, corresponding to different routes
│   ├── store/             # State management files (Redux)
│   ├── tests/             # Test files for the application
│   ├── utils/             # Utility functions and helpers
│   └── setup-tests.js     # Configuration for test environment
├── .gitignore             # Specifies files ignored by git
├── eslint.config.js       # ESLint configuration for code linting
├── package.json           # Defines project dependencies and scripts
├── tailwind.config.js     # Configuration for Tailwind CSS
└── vite.config.js         # Configuration for the Vite build tool
```

### Additional Notes
1. Create directories for any page and layout for clean structure
2. Use Pascal-Case when creating a directory inside any of those directories
3. Use **utils** directory when making a general function (ex: a date formatter)

## Code Formatting
We will be using prettier for this project
1. Install prettier extension on vscode
2. Upon finishing, right click and click format with, choose prettier