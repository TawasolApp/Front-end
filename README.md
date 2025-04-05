# 🚀 TawasolApp

This repository is the source code for the frontend of linkedin-clone

## 🧰 Technology Stack

- Framework and Libraries: React, Redux, Axios
- Language: Javascript
- Build Tool: Vite
- Styling: Tailwind CSS
- Testing: Vitest

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## ⚙️ Setup

1. Clone the repository:

```bash
git clone https://github.com/TawasolApp/Front-end.git
cd Front-end
```

2. Install dependencies:

```bash
npm install
```

## ▶️ Running the Project

#### Start the development server:

1. First you need to update the base URL with backend URL:

```bash
VITE_APP_BASE_URL=https://tawasolapp.me/api/
```

2. Then you can normally run vite project:

```bash
npm run dev
```

#### Or to run with a mock server:

```bash
npm run mock
```

Then Open your browser and navigate to http://localhost:5173.

## 🧪 Unit Testing

Run tests with Vitest:

```bash
npm run test
```

You can also get coverage after running the tests:

```bash
npm run coverage
```

## 🧪 E2E Testing

First, you have to start the development server (by following the instructions listed earlier).

Run tests with Cypress in GUI mode:

```bash
npm run test:e2e
```

Run tests with Cypress in CLI (batch) mode:

```bash
npm run test:e2e:headless
```

## 📝 Commit Format

Each commit message should follow this format:
`<type>: <description>`

- **`<type>`**: A keyword that describes the purpose of the commit (e.g., `feat`, `fix`, `docs`, etc.)
- **`<description>`**: A concise description of the changes

### 🔖 Commit Types

Use the following types to categorize your commits:
| Type | Description |
|------------|-----------------------------------------------------------------------------|
| feat | A new feature or functionality. |
| fix | A bug fix. |
| refactor | Code changes that neither fix a bug nor add a feature (e.g., code cleanup). |
| test | Adding or updating tests. |
| docs | Documentation changes (e.g., README, comments, or project documentation). |
| revert | Reverting a previous commit. |

## 🌳 Branch Naming Convention

Use the following to name your created branch
| Branch Name | Description |
|--------------------------|-------------------------------------------------------|
| main | Deployment branch. |
| develop | Latest development branch with all merged features. |
| feature/{feature-name} | New feature implementation. |
| bugfix/{bug-name} | Fix bug before merging into develop. |
| test/{feature-name} | New E2E tests for feature. | 

➡️ **Pull Requests** must be created in the `develop` branch for review and testing before merging into main

## 📂 Project Directories Structure

```
FRONT-END/
├── src/                   # Main source code directory
│   ├── app/               # Main directory for the app component
│   ├── apis/              # API service files for backend/mock communication
│   ├── assets/            # Static assets like images, fonts, etc.
│   ├── hooks/             # Custom hooks created by our team
│   ├── layouts/           # Layout components for consistent page structure
│   ├── mocks/             # Mock data for development and testing
│   ├── pages/             # Page components, corresponding to different routes
│   ├── store/             # State management files (Redux)
│   ├── tests/             # Test files for the application
│   ├── utils/             # Utility functions and helpers
│   └── setup-tests.js     # Configuration for test environment
├── cypress/               # Cypress E2E testing directory
│   ├── e2e/               # Cypress test files
│   ├── fixtures/          # Test data for Cypress
│   └── support/           # Setup and custom commands
├── .gitignore             # Specifies files ignored by git
├── eslint.config.js       # ESLint configuration for code linting
├── package.json           # Defines project dependencies and scripts
├── tailwind.config.js     # Configuration for Tailwind CSS
├── postcss.config.js      # Configuration for Tailwind CSS
└── vite.config.js         # Configuration for the Vite build tool
```

## 📐 Coding style

| Rule              | How              |
| ----------------- | ---------------- |
| Directories       | PascalCase       |
| Files             | PascalCase       |
| HTML Functions    | PascalCase       |
| General Functions | camelCase        |
| Global Constants  | UPPER_SNAKE_CASE |
| Constants         | camelCase        |
| Variables         | camelCase        |

## 🌍 Rules

### Pages design rules

1. For every page, create directory inside of pages and/or layouts.
2. For any general state that will only require context, make a storeSlice for it inside of the directory.

### Generalization rules

1. Any general function (eg. date formatting) must be in a specific file in utils directory.
2. Any API calls are only done through the axios instance created inside of `apis` directory.
3. Try to use context instead of redux if the rendering tree is small.


## 🎯 Code Formatting

We will be using prettier for this project

```bash
npx prettier --write <RELATIVE_PATH_TO_THE_FILE>
```
