# 🛍️ Productify — Full-Stack Product Management App

Productify is a full-stack web application for managing products in an e-commerce or inventory system. Built with **React**, **Express**, **MongoDB**, and **JWT-based authentication**, it supports secure admin flows, image uploads, theme-aware UI, and robust CRUD operations.

---

## 🚀 Features

- 🔐 **Admin Authentication** — Secure login with JWT, role-based access control
- 🧾 **Product CRUD** — Add, edit, delete, and view products with image support
- 🌗 **Theme Toggle** — Light/dark mode with CSS variables and smooth transitions
- 📸 **Image Uploads** — Multer-based backend with preview and fallback logic
- 🧠 **Form Validation** — Frontend + backend validation for clean data flow
- 🧼 **Responsive UI** — Mobile-friendly layout with polished modals and forms
- 🧵 **Glassmorphism Design** — Elegant UI with blurred backgrounds and shadows

---

## 🧱 Tech Stack

| Layer       | Tech                          |
|------------|-------------------------------|
| Frontend   | React, React Router, CSS-in-JS |
| Backend    | Express, MongoDB, Mongoose     |
| Auth       | JWT, bcrypt                    |
| Uploads    | Multer                         |
| Styling    | Theme-aware CSS variables      |

---

## 🛠️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/N200251/productify.git
cd productify
```

### 2. Backend Setup
```bash
cd pms-backend
npm install
touch .env
```
Add your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
npm run dev
```
### 3. Frontend Setup
```bash
cd frontend
npm install
```
Start the React app:

```bash
npm start
```

## 📁 Folder Structure
```code
productify/
├── backend/                        # Express.js backend server
│   ├── models/                    # Mongoose schemas (e.g., Product.js, User.js)
│   ├── routes/                    # API route handlers (products, auth)
│   ├── middleware/                # Auth middleware (JWT verification, role checks)
│   └── uploads/                   # Folder for storing uploaded product images
│
├── frontend/                      # React.js frontend application
│   ├── components/               # Reusable UI components (Navbar, ProductCard, ProductForm)
│   ├── pages/                    # Route-based pages (Home, AddProduct, EditProduct, Login)
│   ├── context/                  # Global state providers (AuthContext, ThemeContext)
│   └── styles/                   # Theme-aware CSS files and global styles

```
