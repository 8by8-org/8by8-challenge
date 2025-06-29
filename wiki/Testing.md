# Testing

## Overview

This document outlines how testing is performed in the 8by8 Challenge project. It provides details on tools, local setup, CI/CD execution, code coverage requirements, utilities, and troubleshooting tips for developers working on the project.

---

## Testing Frameworks

Testing Frameworks

Jest – Used for unit and integration tests. [Jest Docs](https://jestjs.io/)

React Testing Library – For testing React components through simulated user interactions. [RTL Docs](https://testing-library.com/docs/react-testing-library/intro/)

JSDOM – Emulates a browser-like environment to enable testing of browser APIs within Node.js. [JSDOM Docs](https://github.com/jsdom/jsdom)

Selenium – Used for end-to-end testing. [Selenium Docs](https://www.selenium.dev/documentation/)

---

## Running Unit Tests Locally

Before running unit tests, make sure Docker is running and the necessary local environments are set up.

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Supabase Test Environment

```bash
npm run supabase-test:start
```

(If dev Supabase is already running, stop it first: `npm run supabase-dev:stop`)

### 3. Start Local KV Emulator

```bash
npm run kv:start
```

### 4. Run Tests

```bash
npm run test
```

### 5. Run with Coverage

```bash
npm run test:coverage
```

### 6. View Coverage Report

Open:

```
coverage/lcov-report/index.html
```

---

## CI/CD Testing Pipeline

CI tests are automated using **GitHub Actions** and include:

- **Pull Requests:**

  - All Jest unit tests run.
  - Code coverage must pass.

- **Staging Branch Merge:**

  - Application is deployed to Supabase staging.
  - A URL is generated and used to run **Selenium end-to-end tests**.

---

## Selenium End-to-End Tests

### Prerequisites

- Python 3
- Selenium
- Pytest

### Setup

1. **Create Virtual Environment**

```bash
python3 -m venv venv
```

2. **Activate Environment**

- macOS/Linux:

```bash
source venv/bin/activate
```

- Windows:

```bash
venv\Scripts\activate
```

3. **Install Selenium and Pytest**

```bash
pip install selenium pytest
```

4. **Build and Start Project for Testing**

```bash
npm run build:local
npm run start
```

5. **Run Tests**

```bash
cd src/__tests__/e2e
python3 -m pytest
```

---

## Code Coverage Requirements

**100% coverage is required** across:

- Statements
- Branches
- Functions
- Lines

This ensures:

- No untested critical paths.
- Prevents degradation of code quality.
- Encourages writing maintainable, testable code.

---

## Custom Utilities for Testing

- `renderWithProviders()` – Simplifies rendering components with context providers.
- `mockApi()` – Provides a structured way to mock API requests.
- `setupTestEnv.js` – Shared setup/teardown logic for tests.

---

## Troubleshooting Common Issues

### ❗ Browser API Errors (e.g., `localStorage` is undefined)

- Confirm `jest.config.js` has:

```js
testEnvironment: 'jsdom';
```

- Use mocks:

```js
jest.fn(), jest.mock(), etc.
```

### ❗ Multiple Tests Failing

- Did you:
  - Start Supabase?
    ```bash
    npm run supabase-test:start
    ```
  - Stop dev Supabase first?
    ```bash
    npm run supabase-dev:stop
    ```
  - Run `kv:start`?
  - Update `.env` with correct Supabase and KV values?

---
