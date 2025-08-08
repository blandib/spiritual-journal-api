# Spiritual Journaling API

## About
This API powers a digital journaling platform where users can document their spiritual journey, reflect on scriptures, and share insights with a community.  
It provides backend functionality for creating, organizing, and sharing faith-based reflections.

---

## 🌐 Live Links
- **Live Demo**: https://spiritual-journal-api.onrender.com  
- **Live Swagger UI**: https://spiritual-journal-api.onrender.com/api-docs  
- **Local Swagger UI** (after running locally): http://localhost:3001/api-docs  

---

## 📌 Features
- **Users API**:  
  - `GET /users` – Retrieve all users  
  - `GET /users/{id}` – Retrieve a single user by ID  
  - `POST /users` – Create a new user  
  - `PUT /users/{id}` – Update an existing user  
  - `DELETE /users/{id}` – Delete a user  

- **Entries API**:  
  - `GET /entries` – Retrieve all entries  
  - `GET /entries/{id}` – Retrieve a single entry  
  - `POST /entries` – Create a new entry  
  - `PUT /entries/{id}` – Update an existing entry  
  - `DELETE /entries/{id}` – Delete an entry  

- **Error Handling**:  
  - 400 – Validation error  
  - 404 – Resource not found  
  - 500 – Server error  

---

## 🛠️ Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/blandib/spiritual-journal-api.git
cd spiritual-journal-api/backend
