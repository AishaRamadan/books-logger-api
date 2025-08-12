# 📚 Books Logger API

A simple RESTful API for managing books and users, built with **Node.js**, **Express**, and **MongoDB**.

## 🛠 Tech Stack
- **Node.js** + **Express.js** (Server)
- **MongoDB** + **Mongoose** (Database)
- **JWT** (Authentication)
- **Bcrypt.js** (Password Hashing)
- **Swagger UI** (API Documentation)

## 🔐 Verification
- User authentication using JWT.
- Role-based access control for admin-only routes.
- Password hashing with Bcrypt before saving to the database.

## Endpoints Overview

### Users
- **GET /users** → Get all users (Admin only).
- **POST /users** → Register a new user.
- **PATCH /users/:id** → Update user details by ID.
- **DELETE /users/:id** → Delete user by ID.
- **POST /users/login** → Login and get authentication token.
- **POST /users/refresh-token** → Get a new token using refresh token.

### Books
- **GET /books** → Get all books (with user details).
- **GET /books/:id** → Get a single book by ID.
- **POST /books** → Add a new book.
- **PATCH /books/:id** → Update book details by ID.
- **DELETE /books/:id** → Delete book by ID.


## 🚀 Getting Started
1. Install dependencies:
```bash
npm install
```
*(No `.env` file is used — all configuration values are set directly in the code.)*

3. Run the server:
```bash
npm run dev 
```

## 📖 API Docs
After running the server, visit:  
[Open API Docs](http://localhost:3000/api-docs)

