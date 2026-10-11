# Contributing to Lost & Found Campus

Thank you for your interest in contributing to **Lost & Found Campus**! 🎉

Lost & Found Campus is a community-driven web application designed to help college students report lost belongings, browse found items, and safely coordinate the return of misplaced property. We welcome contributions of all kinds — whether you are fixing a bug, adding new features, improving documentation, or refining UI/UX and accessibility.

This guide will walk you through setting up the project locally, understanding the development workflow, and submitting your contributions smoothly.

---

## Table of Contents

- [Code of Conduct & Etiquette](#code-of-conduct--etiquette)
- [Before You Begin](#before-you-begin)
- [Local Development Setup](#local-development-setup)
  - [Prerequisites](#prerequisites)
  - [Step 1: Fork and Clone](#1-fork-and-clone)
  - [Step 2: Backend Setup](#2-backend-setup)
  - [Step 3: Frontend Setup](#3-frontend-setup)
  - [Step 4: Verify Your Setup](#4-verify-your-setup)
- [Development Workflow](#development-workflow)
  - [1. Keep Your Fork Synced](#1-keep-your-fork-synced)
  - [2. Branching Guidelines](#2-branching-guidelines)
  - [3. Coding Guidelines](#3-coding-guidelines)
  - [4. Testing Your Changes](#4-testing-your-changes)
  - [5. Commit Message Conventions](#5-commit-message-conventions)
  - [6. Submitting a Pull Request](#6-submitting-a-pull-request)
- [Troubleshooting Common Issues](#troubleshooting-common-issues)
- [Reporting Issues](#reporting-issues)
- [Security](#security)
- [Getting Help](#getting-help)

---

## Code of Conduct & Etiquette

- Be welcoming, inclusive, and respectful toward other contributors.
- Provide constructive feedback during code reviews.
- Focus on the issue at hand and help beginners learn.

---

## Before You Begin

To keep our issue tracker organized and avoid duplicated effort:

1. **Check Existing Issues & PRs:** Before starting, search existing issues and pull requests to make sure no one is already working on the same problem.
2. **Claim or Open an Issue:** If you find an issue you'd like to work on, leave a comment asking to be assigned. For new features or significant changes, open an issue first to discuss your proposal with the maintainers.
3. **Keep Scope Focused:** Address a single concern per pull request. Smaller, focused PRs are reviewed and merged much faster than large, sweeping changes.

---

## Local Development Setup

The project is organized into two main parts:
- **Frontend:** React 19, Vite, Tailwind CSS, Axios, React Router.
- **Backend:** Node.js, Express, MongoDB with Mongoose, JWT authentication, Multer for file uploads.

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.x or higher recommended) & **npm** (v9.x or higher)
- **Git**
- **MongoDB** (A local MongoDB instance running, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) connection URI)

---

### 1. Fork and Clone

1. Fork the repository on GitHub by clicking the **Fork** button at the top right of the repository page.
2. Clone your fork to your local machine:

   ```bash
   git clone https://github.com/<your-username>/lost-found-campus.git
   cd lost-found-campus
   ```

3. Configure the upstream remote to stay synced with the main repository:

   ```bash
   git remote add upstream https://github.com/Geektoberfest/lost-found-campus.git
   ```

4. Verify your configured remotes:

   ```bash
   git remote -v
   ```

---

### 2. Backend Setup

1. Open a terminal and navigate to the `backend` folder:

   ```bash
   cd backend
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Create your environment configuration file:
   Create a `.env` file inside the `backend/` directory:

   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/lost-found-campus
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

   > [!NOTE]
   > - If you are using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.mongodb.net/lost-found-campus?retryWrites=true&w=majority`).
   > - Never commit your `.env` file to Git. It is already included in `backend/.gitignore`.

4. Start the backend development server:

   ```bash
   npm run dev
   ```

   The backend will start with `nodemon` and listen on **`http://localhost:3000`**. You should see a message confirming the database connection.

---

### 3. Frontend Setup

1. Open a **second terminal** and navigate to the `frontend` folder from the repository root:

   ```bash
   cd frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

4. The frontend will launch (usually at **`http://localhost:5173`**). Open the displayed URL in your browser.

> [!TIP]
> The frontend API client is configured in `frontend/src/services/api.js` with a default base URL of `http://localhost:3000`. If your backend runs on a different port, update that file accordingly.

---

### 4. Verify Your Setup

Once both servers are running:
1. Open `http://localhost:5173` in your browser.
2. Register a new test user account and log in.
3. Try creating a sample lost or found item report to confirm frontend-backend communication and database connectivity.

---

## Development Workflow

### 1. Keep Your Fork Synced

Before creating a new branch, always ensure your local `main` branch is up to date with the upstream repository:

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

---

### 2. Branching Guidelines

Always create a new, descriptive branch from `main` for each issue or task:

```bash
git checkout -b <branch-prefix>/<short-description>
```

#### Branch Naming Prefixes

| Prefix | Purpose | Example |
|---|---|---|
| `feat/` | Adding a new feature | `feat/item-search-filter` |
| `fix/` | Fixing a bug | `fix/claim-ownership-check` |
| `docs/` | Documentation improvements | `docs/contributor-guide-update` |
| `refactor/` | Code refactoring without changing functionality | `refactor/api-service-cleanup` |
| `test/` | Adding or updating tests | `test/auth-route-tests` |
| `style/` | Code formatting or UI styling fixes | `style/mobile-navbar-padding` |

---

### 3. Coding Guidelines

#### General Rules
- Keep changes clean, modular, and focused on the assigned issue.
- Follow existing naming conventions and folder structures.
- Do not commit generated files, temporary artifacts, build directories (`dist/`), `node_modules/`, or personal `.env` files.
- Preserve existing comments and docstrings unless directly updating modified logic.

#### Frontend Guidelines (`frontend/src/`)
- **Components:** Reuse existing components in `src/components/` and create modular, single-responsibility components.
- **Styling:** Use Tailwind CSS utility classes consistently with existing design patterns.
- **State & UX:** Always handle loading spinners, error messages, empty states, and success confirmations.
- **Responsiveness & Accessibility:** Ensure all forms, buttons, and layouts look good and work seamlessly on mobile, tablet, and desktop screens.
- **Form Validation:** Provide clear, user-friendly feedback on form inputs before and after submission.

#### Backend Guidelines (`backend/src/`)
- **Data Validation:** Always validate incoming request payloads in controllers or validation middleware before writing to the database.
- **Authorization & Security:**
  - Verify JWT tokens on protected routes.
  - Strictly enforce resource ownership: users should only be able to edit, delete, or approve/reject claims for their own items. Never rely solely on frontend button visibility.
  - Never return sensitive data (e.g., password hashes, secret tokens) in responses.
- **File Uploads:** Follow the Multer upload configuration for images; validate file extensions and size limits.
- **Consistent Responses:** Use consistent JSON response formats with appropriate HTTP status codes (e.g., `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`).

---

### 4. Testing Your Changes

Before submitting your pull request, thoroughly verify your changes:

#### Frontend Checks
From the `frontend/` directory:
```bash
# Run validation tests (if applicable)
npm run test

# Verify production build passes without syntax or bundle errors
npm run build
```

#### Backend & Manual Verification
- Test all affected API endpoints and corresponding UI workflows.
- **Permission checks:** Test edge cases, such as attempting to edit/delete another user's item or claim.
- **Claim workflow:** Verify submitting a claim, checking claims as the item owner, and approving/rejecting claims.
- **Status transitions:** Ensure item status (e.g., `lost`, `found`, `claimed`, `recovered`) updates accurately when actions are performed.
- **Image upload:** Verify file type validation, size limits, and proper image rendering on the frontend.
- **Console & logs:** Check the browser console and server terminal logs for unhandled errors, warnings, or unhandled promise rejections.

---

### 5. Commit Message Conventions

We follow clear, descriptive commit messages inspired by [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>: <short imperative summary in lowercase>

[optional longer body explaining 'why' rather than 'what']
```

#### Examples

- `feat: add category filter to browse items page`
- `fix: prevent unauthorized users from updating claim status`
- `docs: update setup instructions in contributing guide`
- `refactor: extract reusable modal component for claim submission`
- `test: add validation check for registration form fields`

---

### 6. Submitting a Pull Request

Once you have implemented and tested your changes:

1. **Commit your changes:**
   ```bash
   git add <modified-files>
   git commit -m "feat: your concise commit message"
   ```

2. **Push your branch to your GitHub fork:**
   ```bash
   git push origin <your-branch-name>
   ```

3. **Open the Pull Request:**
   - Go to your fork on GitHub.
   - Click the **Compare & pull request** button next to your recently pushed branch.
   - Ensure the base repository is set to the original repository and the correct branch (usually `main`).

4. **Fill out the Pull Request Description:**
   - **Title:** Provide a clear, descriptive title matching your commit message.
   - **Description:** Explain *what* was changed and *why*.
   - **Issue Reference:** Link related issues using keywords like `Fixes #12` or `Closes #45`.
   - **Screenshots / GIFs:** If you made visual or UI changes, include before-and-after screenshots.
   - **Testing Details:** Describe the manual or automated tests you performed.

5. **Address Feedback:**
   - Maintainers or other contributors may review your code and suggest changes.
   - Make the required updates on your local branch, commit, and push. Your pull request will automatically update!

---

## Troubleshooting Common Issues

### 1. MongoDB Connection Failed (`MongooseServerSelectionError`)
- **Cause:** Local MongoDB service is not running, or your MongoDB Atlas URI/credentials are incorrect.
- **Fix:**
  - If using local MongoDB: Make sure the MongoDB service is active (`mongod` or your system's service manager).
  - If using MongoDB Atlas: Verify your username, password, database name, and ensure your current IP address is whitelisted in Atlas Network Access.

### 2. Port Already in Use (`EADDRINUSE: address already in use :::3000`)
- **Cause:** Another process is running on port 3000.
- **Fix:** Stop the running process, or set a different port in `backend/.env` (e.g., `PORT=3001`), and update the base URL in `frontend/src/services/api.js`.

### 3. API Requests Failing / CORS Errors
- **Cause:** Frontend cannot communicate with the backend, or backend is not running.
- **Fix:** Ensure both `npm run dev` in `backend` and `npm run dev` in `frontend` are actively running in separate terminals. Verify that `frontend/src/services/api.js` points to `http://localhost:3000`.

### 4. Accidental Files Staged (`node_modules`, `.env`, build files)
- **Fix:** Unstage files before committing:
  ```bash
  git reset <filename>
  ```
  Ensure `.env` and `node_modules` are listed in `.gitignore`.

---

## Reporting Issues

Found a bug or have an idea for an enhancement? Open an issue!

- **Bug Reports:**
  - Use a clear and descriptive title.
  - Include step-by-step instructions to reproduce the behavior.
  - Describe the expected vs. actual outcome.
  - Include screenshots and browser/terminal console logs where applicable.
- **Feature Requests:**
  - Explain the problem or limitation you are facing.
  - Outline the proposed solution and how it benefits students using the platform.

> [!WARNING]
> Please **do not** post real student identification cards, private contact details, sensitive passwords, or personal credentials in public issues or discussions.

---

## Security

If you discover a security vulnerability (such as an authentication bypass, sensitive data leak, or injection vulnerability):
- Please **do not** open a public issue.
- Contact the repository maintainers privately so the issue can be addressed responsibly.

---

## Getting Help

If you have questions, get stuck during setup, or want feedback on an approach:
- Post your question in the project's discussions or comment directly on the relevant issue.
- Feel free to ask maintainers for guidance—we are happy to help new contributors!

Thank you for contributing to Lost & Found Campus! 🚀
