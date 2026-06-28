# Collective Platform CMS

A modern full-stack MERN CMS built for managing collective events, galleries, videos, team members, homepage content and website settings.

The project consists of a public website and a secure administration panel with Role-Based Access Control (RBAC), activity logging, media management and automated database backups.

---

# Features

## Public Website

- Home page
- Events
- Gallery
- Videos
- Team
- Contact form
- Dynamic website settings
- Fully responsive

---

## Admin Panel

### Authentication

- Secure JWT Authentication
- Protected Routes
- Password Hashing (bcrypt)
- Persistent Login

---

### Role-Based Access Control (RBAC)

- Super Admin
- Custom Roles
- Permission Management

Permissions are managed per module.

Example:

- Events
- Gallery
- Videos
- Team
- Home Content
- Messages
- Settings
- Admins

Each permission supports:

- Create
- Read
- Update
- Delete

Super Admin automatically bypasses all permission checks.

---

### Admin Management

Super Admin can:

- Create Admins
- Create Roles
- Assign Roles
- Activate/Deactivate Admins

---

### Content Management

The CMS allows administrators to manage:

- Homepage Content
- Events
- Gallery Images
- Videos
- Team Members
- Website Settings

---

### Contact Messages

Visitors can send contact messages.

Administrators can:

- Read
- Delete

Unread messages are displayed in the dashboard.

---

### Activity Logs

Every successful admin action is logged.

Tracked information includes:

- Administrator
- Action
- Module
- HTTP Method
- Status Code
- Date
- Target Item

Only Super Admin can access Activity Logs.

---

### Media Management

Images are stored using Cloudinary.

Automatic cleanup is performed whenever an image is deleted or replaced.

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- TailwindCSS
- React Router
- Axios

---

## Backend

- Node.js
- Express
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Cloudinary

---

## Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

Media

- Cloudinary

Domain

- GoDaddy

---

# Security

Implemented security features include:

- Helmet
- CORS
- Rate Limiting
- JWT Authentication
- Password Hashing
- Protected API Routes
- RBAC
- Activity Logging

---

# Database Backup

Automatic backups are performed using GitHub Actions.

Every backup is:

- Uploaded as a GitHub Artifact
- Uploaded to Google Drive
- Stored locally (manual backups)

Restore scripts are included inside the project.

See:

BACKUP.md

---

# Project Structure

```
collective-platform
│
├── backend
│   ├── src
│   ├── scripts
│   └── ...
│
├── frontend
│   ├── src
│   └── ...
│
├── .github
│   └── workflows
│
├── backups
│
├── scripts
│
└── README.md
```

---

# Installation

## Clone

```bash
git clone https://github.com/ayham-eddin/collective-platform.git
```

---

## Backend

```bash
cd backend
npm install
```

Create

```
.env
```

Run

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Environment Variables

Backend requires:

```
PORT
NODE_ENV

MONGO_URI

JWT_ACCESS_SECRET
JWT_REFRESH_SECRET

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

CLIENT_URL
```

Additional variables may be required depending on deployment.

---

# Scripts

Backend

```bash
npm run dev
npm run build
npm run start
```

MongoDB

```bash
npm run backup:mongo

npm run restore:mongo backups/mongodb/file.gz
```

---

# License

Private Project

All rights reserved.
