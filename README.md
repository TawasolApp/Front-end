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

1. First you need to add a .env file containing all the needed env variables

```bash
VITE_APP_BASE_URL=https://tawasolapp.me/api/
VITE_APP_RECAPTCHA_SITE_KEY=6LdMDv0qAAAAAC935jMxhIW2ZSMaei6Hs1YU2PyR
VITE_GOOGLE_CLIENT_ID=255166583275-q52g6235gpjiq68u9o23doqcs2sdi9h2.apps.googleusercontent.com
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

## 🧪 Testing

Run tests with Vitest:

```bash
npm run test
```

You can also get coverage after running the tests:

```bash
npm run coverage
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
