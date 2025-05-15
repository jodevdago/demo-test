
# demo-test

## 🧪 Unit Testing

This project uses **Jest** for unit testing.

### Commands

- Run tests:
  ```bash
  npm run test
  ```

- Check test coverage:
  ```bash
  npm run test:coverage
  ```

---

## ⚙️ Local Setup

Before running the app locally, ensure you're using **Angular v18** and a **Node.js LTS** version (recommended: Node.js ≥ 18.x).

### Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app in development mode:
   ```bash
   npm start
   ```

3. Build the app for production:
   ```bash
   npm run build
   ```

---

## 🐳 Docker Usage

This project supports two Docker modes: **development** and **production**.

### 🔧 Development Mode

Run the app in development mode with hot reload:

```bash
docker compose up --build angular-dev
```

- Access the app at: [http://localhost:4200](http://localhost:4200)

This mode is ideal during development, as it mounts the local source code and enables live reloading.

---

### 🚀 Production Mode

Build and run the app in production mode:

```bash
docker compose up --build angular-prod
```

- Access the app at: [http://localhost:8080](http://localhost:8080)

This mode serves the optimized production build using NGINX.

---

## 🔐 Admin Access

A single admin account is available for demo/testing purposes:

- **Email**: jogasy.rabefialy@gmail.com  
- **Password**: Jogasy@admin

---

## 🌐 Live Demo

You can try the app online at:

👉 [https://it-support-test.vercel.app/](https://it-support-test.vercel.app/)

---
