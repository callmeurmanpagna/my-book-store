# 📚 My Book Store

A full-stack online bookstore: React + Tailwind CSS frontend, Node.js/Express backend, MySQL database, JWT auth, and **Google Sign-In via Firebase Authentication**.

## Project Structure

```
my-book-store/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MySQL connection pool
│   │   └── firebaseAdmin.js      # Firebase Admin SDK (verifies Google tokens)
│   ├── controllers/
│   │   ├── authController.js     # register, login, google login, /me
│   │   ├── bookController.js     # CRUD + search/filter
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   └── adminController.js    # dashboard stats
│   ├── middleware/
│   │   └── authMiddleware.js     # verifyToken, isAdmin
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── database/
│   │   └── schema.sql            # MySQL schema + default admin
│   ├── seed/
│   │   └── seedBooks.js          # creates admin + 12 demo books
│   ├── server.js                 # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/axios.js          # axios instance w/ JWT interceptor
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # login/register/google login/logout
│   │   │   ├── CartContext.jsx
│   │   │   └── ThemeContext.jsx  # dark/light mode
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── BookCard.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AdminRoute.jsx
│   │   │   └── Loader.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Books.jsx
│   │   │   ├── BookDetails.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ManageUsers.jsx
│   │   │       ├── ManageBooks.jsx
│   │   │       └── ManageOrders.jsx
│   │   ├── firebase.js           # Firebase client config + Google provider
│   │   ├── App.jsx                # routes
│   │   ├── main.jsx               # entry point + providers
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 1. Prerequisites

- Node.js 18+
- MySQL 8+ running locally (or a cloud MySQL instance)
- A free [Firebase](https://console.firebase.google.com) project (for Google Sign-In)

---

## 2. Database Setup

```bash
mysql -u root -p < backend/database/schema.sql
```

This creates the `my_book_store` database, all tables, and a default admin (`admin@bookstore.com` / `admin123`).

Then seed 12 demo books (and refresh the admin password, guaranteeing it matches your bcrypt version):

```bash
cd backend
npm install
cp .env.example .env      # then edit .env with your DB credentials
npm run seed
```

---

## 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=my_book_store
JWT_SECRET=some_long_random_string
```

Run it:
```bash
npm run dev      # nodemon, auto-restarts
# or
npm start
```

API runs at `http://localhost:5000`. Health check: `GET /api/health`.

---

## 4. Firebase Setup (Google Login)

1. Go to the [Firebase Console](https://console.firebase.google.com) → **Create a project**.
2. In your project: **Build → Authentication → Sign-in method → Google → Enable**.
3. **Add a Web App** (Project Settings → General → Your apps → `</>`) to get your web config (`apiKey`, `authDomain`, etc.). Put these into `frontend/.env` (see step 5).
4. **Generate a service account key** for the backend: Project Settings → **Service Accounts** → **Generate new private key**. This downloads a JSON file containing `project_id`, `client_email`, and `private_key`. Put these into `backend/.env`:
   ```
   FIREBASE_PROJECT_ID=...
   FIREBASE_CLIENT_EMAIL=...
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```
   (Keep the `\n` characters literal — the code converts them to real newlines.)

**How it works:** the frontend uses Firebase's `signInWithPopup` with `GoogleAuthProvider` to sign the user in with their Google account, then sends the resulting Firebase ID token to `POST /api/auth/google`. The backend verifies that token with Firebase Admin, creates the user in MySQL if they're new (with `auth_provider = 'google'`, no password), and returns our own JWT — so the rest of the app (protected routes, admin checks, etc.) works exactly the same for Google and email/password users.

---

## 5. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Run it:
```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## 6. Default Accounts

| Role  | Email                 | Password  |
|-------|------------------------|-----------|
| Admin | admin@bookstore.com    | admin123  |

Regular users register via `/register` (email/password or "Sign up with Google"). Admin logs in separately at `/admin-login` — there is no admin self-registration.

---

## 7. Key API Endpoints

| Method | Endpoint                    | Auth        | Description |
|--------|------------------------------|-------------|--------------|
| POST   | /api/auth/register            | Public      | Register with name/email/password |
| POST   | /api/auth/login                | Public      | Email/password login |
| POST   | /api/auth/google                | Public      | Google login (Firebase ID token) |
| GET    | /api/auth/me                    | User        | Current user info |
| GET    | /api/books?search=&category=   | Public      | List/search/filter books |
| GET    | /api/books/featured             | Public      | Featured books for homepage |
| GET    | /api/books/:id                   | Public      | Book details |
| POST   | /api/books                        | Admin       | Add book |
| PUT    | /api/books/:id                    | Admin       | Edit book |
| DELETE | /api/books/:id                    | Admin       | Delete book |
| GET/POST/PUT/DELETE | /api/cart               | User        | Manage cart |
| POST   | /api/orders                        | User        | Place order from cart |
| GET    | /api/orders/mine                    | User        | Order history |
| GET    | /api/orders                          | Admin       | All orders |
| PUT    | /api/orders/:id/status                | Admin       | Update order status |
| GET/PUT| /api/users/profile                     | User        | View/edit profile |
| GET/DELETE | /api/users, /api/users/:id          | Admin       | Manage users |
| GET    | /api/admin/stats                         | Admin       | Dashboard stats |

---

## 8. Security Notes

- Passwords hashed with **bcrypt** (10 rounds).
- **JWT** issued on login/register/google-login, required on all protected routes via `Authorization: Bearer <token>`.
- `verifyToken` + `isAdmin` middleware enforce role-based access control on admin routes.
- Google Sign-In tokens are verified server-side with Firebase Admin (never trust a client-supplied UID/email alone).
- Basic input validation on register/login/book forms — extend with `express-validator` (already a dependency) for stricter rules as needed.

---

## 9. Notes / Next Steps

- No payment gateway is integrated — orders are created with `status = 'Pending'` for the admin to manage.
- Book cover images use placeholder URLs (OpenLibrary covers) in the seed data — swap in your own via the admin "Add/Edit Book" form (`image` field accepts any URL).
- Dark/light mode is handled via a `ThemeContext` that toggles the `dark` class on `<html>`, matching Tailwind's `darkMode: 'class'` config.
