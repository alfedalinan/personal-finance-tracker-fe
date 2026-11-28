# Personal Finance Tracker - Frontend

A modern, responsive frontend application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS** for tracking personal finances, managing accounts, viewing transaction summaries, and recording new transactions.

## 📸 Application Preview

![Dashboard Preview](./public/preview.png)

---

## 🏛️ System Architecture & Backend Prerequisites

The Personal Finance Tracker frontend communicates with a distributed microservice backend ecosystem. To run and test the frontend fully, ensure the following backend repositories are running locally or pointed to via environment configuration:

1. **API Gateway** ([personal-finance-tracker-api-gateway](https://github.com/alfedalinan/personal-finance-tracker-api-gateway)):
   - **Role:** Entry point for frontend requests, routing traffic to downstream microservices and handling cross-cutting concerns (CORS, proxying).
   - **Default Port/URL:** `http://localhost:8080` (or configured proxy target).
2. **Identity Service** ([personal-finance-tracker-identity](https://github.com/alfedalinan/personal-finance-tracker-identity)):
   - **Role:** Handles user authentication, JWT token issuance, registration, and user session management.
   - **Default Port/URL:** `http://localhost:8081` (or accessed via API Gateway).
3. **Core Backend** ([personal-finance-tracker-be](https://github.com/alfedalinan/personal-finance-tracker-be)):
   - **Role:** Manages accounts, categories, transactions, budgets, and financial reports.
   - **Default Port/URL:** `http://localhost:8082` (or accessed via API Gateway).

### Recommended Startup Order
1. Start the database / supporting infrastructure.
2. Start the **Identity Service** and **Core Backend**.
3. Start the **API Gateway**.
4. Start the **Frontend Development Server** (`npm run dev`).

---

## 🚀 Features & Implementation Progress

### **Authentication & Authorization**
- **Login & Registration:** Secure authentication flow supporting user sign-in and registration (`LoginView`, `RegisterModal`).
- **Protected Routes:** Automatic redirection of unauthenticated users to `/login` using React Router DOM.
- **Auth Context:** Token and user state management persist across session navigation.

### **Dashboard View**
- **Financial Overview:** Summary cards showing total balance, income, expenses, and account summaries.
- **Recent Transactions:** Quick inspection of recent financial activity.
- **Navigation:** Seamless switching between Dashboard and Transactions management.

### **Transactions View**
- **Detailed Listing:** Comprehensive view of all recorded financial transactions with filtering and pagination support.
- **Action Triggers:** Direct access to add new transactions or manage entries.

### **Add Transaction Modal (`PFT-FE-001`)**
- **Modal Overlay & Trigger:** Accessible modal opened directly from the "Add Transaction" button in both Dashboard and Transactions views.
- **Dynamic Dropdown Data Fetching:** Automatically fetches account options (`/api/accounts/list` with fallback to summary) and category options (`/api/categories/list`) with loading spinners.
- **Robust Error & Retry Handling:** Inline error banner with a **"Retry"** button when network or API fetching fails.
- **Client-Side Validation:** Ensures required fields (Account, Category, Amount, Description) are populated and valid. Amount input fully supports decimal numbers and negative values. The submit button remains disabled until validation passes.
- **Submission & Post-Submission UX:** Sends a `POST /api/transactions` request payload, automatically closes the modal upon success, displays a success toast notification, and refreshes the underlying view data seamlessly without full page reloads.

---

## 🛠️ Tech Stack
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router DOM (v7)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- Running backend services (API Gateway, Identity Service, Core Backend) as outlined in [System Architecture & Backend Prerequisites](#-system-architecture--backend-prerequisites).

### Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/alfedalinan/personal-finance-tracker-fe.git
   cd personal-finance-tracker-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment:
   Ensure API base URLs point to your running API Gateway / backend instances.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

6. Run linter and type-checking:
   ```bash
   npm run lint
   ```
