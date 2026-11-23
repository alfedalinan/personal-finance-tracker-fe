# Personal Finance Tracker - Frontend

A modern, responsive frontend application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS** for tracking personal finances, managing accounts, viewing transaction summaries, and recording new transactions.

## 📸 Application Preview

![Dashboard Preview](./public/preview.png)

---

## 🚀 Features & Implementation

### **PFT-FE-001: Add Transaction Modal & Form**
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
- **Routing:** React Router DOM

---

## 📦 Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

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

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Run linter and type-checking:
   ```bash
   npm run lint
   ```
