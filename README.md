# 🏦 Bank Information Management System

A full-stack web application developed using **Node.js, Express, React, and MongoDB**.This system allows users to securely manage their bank account details, while providing administrators with tools to view and filter user data

## 🚀 Features

### 👤 User Panel

  * **Authentication:** Secure User Registration & Login using **JWT** and **bcrypt** for password hashing
      * Add multiple bank accounts (IFSC, Branch, Account Number, etc.)
      * **Strict Validation:** Validates IFSC format and Account Number digits
      * View list of added accounts.
      * Edit existing account details
      * Delete accounts securely

### 🛠️ Admin Panel

  * **Global Access:** View bank account details of **all** registered users
  * **Advanced Search:** Filter records by **Username**, **Bank Name**, or **IFSC Code**

-----

## 🧰 Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React.js |Client-side library
| **Styling** | CSS3 | Custom Monochromatic Design System (No Frameworks) |
| **Backend** | Node.js & Express | [ \_start]Server-side runtime and framework  |
| **Database** | MongoDB | NoSQL Database  |
| **Auth** | JWT & Bcrypt | Security & Encryption  |

-----

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1\. Prerequisites

  * Node.js (v14+)
  * MongoDB (Local or Atlas Connection String)

### 2\. Clone the Repository

```bash
git clone https://github.com/vaibhav-bhosale1/bank-management-system.git
cd bank-management-system
```

### 3\. Backend Setup

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following credentials:

```env
PORT=5000
MONGO_URI=mongodb+srv://<your_mongo_connection_string>
JWT_SECRET=your_super_secret_key_123
```

Run the backend server:

```bash
npm run dev
```

*Server should run on `http://localhost:5000`*

### 4\. Frontend Setup

Open a new terminal, navigate to the frontend folder, and install dependencies:

```bash
cd ../frontend
npm install
```

Start the React application:

```bash
npm start
```

*The app will open at `http://localhost:3000`*

-----

## 🔌 API Endpoints

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/` | Register a new user | Public |
| POST | `/login` | Authenticate user & get token | Public |

### Bank Routes (`/api/bank`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/` | Add a new bank account | Private (User) |
| GET | `/` | Get logged-in user's accounts | Private (User) |
| PUT | `/:id` | Update specific account | Private (User) |
| DELETE | `/:id` | Delete specific account | Private (User) |
| GET | `/all` | **Admin:** Get all accounts + Search | Private (Admin) |

-----

## 📂 Folder Structure

```
bank-management-system/
├── backend/
│   ├── config/         # Database connection
│   ├── controllers/    # Logic for Users and Bank Accounts
│   ├── middleware/     # Auth protection
[ _start]│   ├── models/         # Mongoose Schemas (User, BankAccount) [ : 32]
│   ├── routes/         # API Routes
│   └── server.js       # Entry point
└── frontend/
    ├── public/
    └── src/
        ├── components/ # Login, Register, Dashboard, Admin
        ├── App.js      # Routing logic
        └── index.css   # Global Monochromatic Design
```

-----

## 🛡️ Input Validation Rules

[ \_start]The system enforces strict data integrity[ : 18]:

1.  **IFSC Code:** Must be 4 letters, followed by 0, followed by 6 alphanumeric characters (e.g., `SBIN0123456`).
2.  **Account Number:** Must be numeric and between 9-18 digits.
3.  **Required Fields:** All fields are mandatory.

-----

## 📸 UI/UX Design

The application features a **Slate Blue Monochromatic** theme for a professional financial look, ensuring high readability and a clean interface without relying on external CSS libraries.

-----

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature-branch`).
3.  Commit your changes (`git commit -m 'Add feature'`).
4.  Push to the branch (`git push origin feature-branch`).
5.  Open a Pull Request.

-----

[ \_start]**Developed for TaskPlanet Assessment** [ : 1]
