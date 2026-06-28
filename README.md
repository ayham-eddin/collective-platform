````md
# Collective Platform CMS

A modern, production-ready full-stack Content Management System (CMS) built for managing cultural events, galleries, videos, team members, homepage content and website settings.

The project consists of two separate applications:

- A modern public website for visitors
- A secure administration panel for content management

The system was designed to allow non-technical administrators to manage all website content without requiring developer assistance.

---

# Overview

The Collective Platform CMS provides everything required to manage a modern event-based website from a single administration dashboard.

The system includes:

- Event Management
- Gallery Management
- Video Management
- Team Management
- Homepage Content Management
- Website Settings
- Contact Messages
- Admin Management
- Role-Based Access Control (RBAC)
- Activity Logging
- Cloudinary Media Management
- Automated MongoDB Backups

The architecture follows a clean separation between frontend, backend and external services, making the project scalable and easy to maintain.

---

# Main Features

## Public Website

Visitors can:

- Browse upcoming events
- Browse previous events
- View event details
- Explore image galleries
- Watch videos
- View team members
- Read homepage content
- Send contact messages
- Access the website from desktop, tablet and mobile devices

No authentication is required for public users.

---

## Admin Panel

Administrators can manage all website content through a secure dashboard.

Supported modules include:

- Dashboard
- Events
- Gallery
- Videos
- Team Members
- Homepage Content
- Website Settings
- Contact Messages
- Activity Logs
- Roles
- Administrators

The CMS was designed so that new modules can easily be added in the future.

---

# Authentication

Authentication is implemented using JSON Web Tokens (JWT).

Features include:

- Secure Login
- JWT Access Tokens
- Protected API Routes
- Persistent Authentication
- Password Hashing using bcrypt
- Secure Authorization Middleware

Only authenticated administrators can access protected endpoints.

---

# Role-Based Access Control (RBAC)

The system includes a flexible Role-Based Access Control implementation.

Each administrator is assigned exactly one role.

Each role contains granular permissions for every CMS module.

Supported modules include:

- Dashboard
- Events
- Gallery
- Videos
- Team
- Home Content
- Contact Messages
- Website Settings
- Administrators

Each module supports independent CRUD permissions:

- Create
- Read
- Update
- Delete

Example:

| Module  | Create | Read | Update | Delete |
| ------- | :----: | :--: | :----: | :----: |
| Events  |   ✅   |  ✅  |   ✅   |   ✅   |
| Gallery |   ✅   |  ✅  |   ❌   |   ❌   |
| Videos  |   ❌   |  ✅  |   ❌   |   ❌   |

Permission checks are enforced entirely on the backend.

---

# Super Admin

The system contains a special Super Admin account.

Unlike normal administrators, the Super Admin:

- Bypasses all permission checks
- Can create new administrators
- Can create roles
- Can assign roles
- Can update administrator accounts
- Can activate or deactivate administrators
- Can view Activity Logs

The Super Admin cannot accidentally lock themselves out through permission changes.

---

# Admin Management

The administration system supports complete administrator management.

Available features include:

- Create administrators
- Edit administrators
- Delete administrators
- Activate administrators
- Deactivate administrators
- Assign roles
- Change passwords
- Update profile information

The administrator list supports pagination and searching.

---

# Content Management

The CMS provides complete content management capabilities.

Administrators can manage:

- Homepage Hero Section
- Homepage Buttons
- About Section
- Events
- Event Images
- Event Videos
- Gallery Images
- Standalone Videos
- Team Members
- Website Settings

All content is editable directly from the administration panel.

No code changes are required to update website content.

---

# Event Management

The Events module supports complete event management.

Each event contains:

- Title
- Slug
- Description
- Event Date
- Event Time
- Location
- Category
- Cover Image
- Gallery Images
- YouTube Videos
- External Ticket URL
- Publication Status

Supported statuses:

- Draft
- Published
- Archived

Events can also be grouped into:

- Upcoming Events
- Previous Events

Public visitors only see published events.

---

# Gallery Management

Gallery management supports:

- Multiple images
- Cloudinary storage
- Featured images
- Image ordering
- Related events
- Publication status
- Soft deletion

Images are automatically optimized by Cloudinary.

---

# Video Management

The Videos module supports standalone public videos.

Each video includes:

- Title
- Description
- YouTube URL
- Thumbnail
- Featured flag
- Publication status

Videos are managed independently from event videos.

---

# Team Management

Administrators can manage team members.

Each member includes:

- Name
- Position
- Biography
- Profile Image
- Social Media Links
- Display Order

Team members are displayed publicly on the website.

---

# Homepage Management

The homepage can be managed directly from the CMS.

Editable sections include:

- Hero Badge
- Hero Title
- Hero Subtitle
- Hero Background Image
- Primary Button
- Secondary Button
- About Section
- About Button

No developer intervention is required to update homepage content.

---

# Website Settings

Global website settings are managed from a dedicated module.

Supported settings include:

- Website Name
- Website Description
- Contact Email
- Contact Phone
- Instagram
- Facebook
- YouTube
- TikTok

These settings are shared across the entire website.

---

# Multi-language Support

The CMS is designed around multilingual content.

Localized fields are stored as objects.

Example:

```json
{
  "title": {
    "de": "Veranstaltung",
    "en": "Event",
    "ar": "فعالية"
  }
}
```

Currently supported languages:

- German
- English
- Arabic

Additional languages can be added in the future without changing the database structure.
````

````md
# Contact Messages

The CMS includes a complete contact message management system.

Visitors can submit messages through the public contact form without creating an account.

Administrators can:

- Read messages
- Mark messages as read
- Archive messages
- Delete messages

Unread messages are displayed directly in the Dashboard.

Messages include:

- Visitor Name
- Email Address
- Subject
- Message
- Status
- Created Date

Supported statuses:

- Unread
- Read
- Archived

---

# Activity Logging

Every successful administrative action is automatically recorded.

The Activity Log provides a complete audit trail of changes performed inside the CMS.

Each log entry contains:

- Administrator
- Administrator Email
- Action
- Module
- HTTP Method
- Status Code
- Request Path
- Target Item ID
- Target Item Title
- IP Address
- User Agent
- Timestamp

Example actions:

- Admin A created the event **"Summer Festival 2026"**
- Admin B updated the gallery image **"Opening Ceremony"**
- Admin C deleted the team member **"John Smith"**

Only the Super Admin can access the Activity Log.

---

# Media Management

The project uses Cloudinary for media storage.

Supported uploads include:

- Images
- Event Cover Images
- Gallery Images
- Team Member Photos
- Homepage Images

Features include:

- Automatic image optimization
- CDN delivery
- Secure uploads
- Automatic deletion
- Automatic replacement
- Public ID tracking

Unused Cloudinary assets are automatically removed when content is deleted or replaced.

---

# Responsive Design

The frontend is fully responsive.

Supported devices:

- Desktop
- Laptop
- Tablet
- Mobile

Layouts automatically adapt to different screen sizes.

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS

---

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt
- Cloudinary
- Multer

---

## Security

- Helmet
- CORS
- Express Rate Limiter
- JWT Authentication
- Password Hashing
- Protected Routes
- Role-Based Access Control
- Activity Logging

---

## Deployment

Frontend

- Vercel

Backend

- Render

Database

- MongoDB Atlas

Media Storage

- Cloudinary

Domain

- GoDaddy

Continuous Integration

- GitHub Actions

---

# Architecture

```text
                         Public Visitors
                                │
                                ▼
                   React + Vite Frontend (Vercel)
                                │
                          Axios REST Requests
                                │
                                ▼
                  Express + TypeScript Backend
                          (Render Hosting)
                                │
                ┌───────────────┴────────────────┐
                │                                │
                ▼                                ▼
        MongoDB Atlas                     Cloudinary
        Database                          Media Storage
                │
                ▼
        GitHub Actions
        Daily Backups
                │
        ┌───────┴────────┐
        ▼                ▼
 GitHub Artifacts    Google Drive
```

---

# Project Structure

```text
collective-platform/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── modules/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── package.json
│   └── .env
│
├── backups/
│
├── scripts/
│
├── .github/
│   └── workflows/
│
├── API.md
├── BACKUP.md
├── DEPLOYMENT.md
├── SECURITY.md
└── README.md
```

---

# Documentation

The project contains detailed documentation for development, deployment and maintenance.

| Document      | Description                              |
| ------------- | ---------------------------------------- |
| README.md     | Project overview                         |
| API.md        | Complete REST API documentation          |
| DEPLOYMENT.md | Production deployment guide              |
| BACKUP.md     | MongoDB backup & restore guide           |
| SECURITY.md   | Security architecture and best practices |

---

# Screenshots

Project screenshots will be added as development progresses.

Suggested screenshots:

## Public Website

- Home Page
- Events
- Event Details
- Gallery
- Videos
- Team
- Contact

## Admin Panel

- Dashboard
- Events
- Gallery
- Videos
- Team Members
- Homepage Editor
- Website Settings
- Contact Messages
- Activity Logs
- Admin Management
- Roles & Permissions
````

````md
# Installation

## Clone the Repository

```bash
git clone https://github.com/ayham-eddin/collective-platform.git
cd collective-platform
```

---

# Backend Installation

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file.

Required environment variables:

```env
PORT=5001

NODE_ENV=development

MONGO_URI=

CLIENT_URL=http://localhost:5173

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=
SUPER_ADMIN_FULL_NAME=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Run the backend:

```bash
npm run dev
```

Build production version:

```bash
npm run build
```

Start production server:

```bash
npm start
```

---

# Frontend Installation

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file.

```env
VITE_API_URL=http://localhost:5001/api
```

Start development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# Environment Variables

## Backend

| Variable               | Description                     |
| ---------------------- | ------------------------------- |
| PORT                   | Express server port             |
| NODE_ENV               | development / production        |
| MONGO_URI              | MongoDB Atlas connection string |
| CLIENT_URL             | Frontend URL                    |
| JWT_ACCESS_SECRET      | JWT access token secret         |
| JWT_REFRESH_SECRET     | JWT refresh token secret        |
| JWT_ACCESS_EXPIRES_IN  | Access token lifetime           |
| JWT_REFRESH_EXPIRES_IN | Refresh token lifetime          |
| SUPER_ADMIN_EMAIL      | Initial Super Admin email       |
| SUPER_ADMIN_PASSWORD   | Initial Super Admin password    |
| SUPER_ADMIN_FULL_NAME  | Initial Super Admin name        |
| CLOUDINARY_CLOUD_NAME  | Cloudinary cloud                |
| CLOUDINARY_API_KEY     | Cloudinary API key              |
| CLOUDINARY_API_SECRET  | Cloudinary API secret           |

---

## Frontend

| Variable     | Description     |
| ------------ | --------------- |
| VITE_API_URL | Backend API URL |

---

# Available Scripts

## Backend

Development server

```bash
npm run dev
```

Compile TypeScript

```bash
npm run build
```

Run production server

```bash
npm start
```

---

## Frontend

Development server

```bash
npm run dev
```

Create production build

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

## MongoDB Backup

Create backup

```bash
npm run backup:mongo
```

Restore backup

```bash
npm run restore:mongo backups/mongodb/backup-file.gz
```

---

# Deployment

Production deployment uses:

| Service  | Provider       |
| -------- | -------------- |
| Frontend | Vercel         |
| Backend  | Render         |
| Database | MongoDB Atlas  |
| Media    | Cloudinary     |
| DNS      | GoDaddy        |
| CI/CD    | GitHub Actions |

Deployment instructions are available in:

```text
DEPLOYMENT.md
```

---

# Backup & Disaster Recovery

The project includes a complete backup strategy.

Backups are automatically:

- Created daily using GitHub Actions
- Stored as GitHub Artifacts
- Retained for 60 days
- Uploaded automatically to Google Drive

Manual backups can also be created locally.

Restore scripts are included in the repository.

For complete instructions see:

```text
BACKUP.md
```

---

# Security

The backend follows several security best practices.

Implemented protections include:

- JWT Authentication
- Password Hashing (bcrypt)
- Helmet
- CORS Protection
- Rate Limiting
- Role-Based Access Control
- Activity Logging
- Cloudinary Secure Uploads
- Environment Variable Protection

For complete documentation see:

```text
SECURITY.md
```

---

# API Documentation

Complete API documentation is available in:

```text
API.md
```

It includes:

- Authentication
- Events API
- Gallery API
- Videos API
- Team API
- Homepage API
- Settings API
- Contact API
- Activity Logs API
- Upload API
- Error Responses
- Permissions
- Pagination
````

````md
# Roadmap

The CMS has been designed with scalability in mind.

Planned future improvements include:

## Content Management

- Multi-category events
- Event tags
- Event registration system
- Ticket availability management
- Event attendance tracking
- Draft autosave
- Revision history
- Scheduled publishing

---

## Media

- Drag & Drop uploads
- Bulk image uploads
- Bulk video uploads
- Folder organization
- Image cropping
- Automatic image compression
- AI-generated alt text

---

## Dashboard

- Advanced analytics
- Visitor statistics
- Popular events
- Contact message analytics
- Content usage reports
- Export reports to PDF
- Export reports to Excel

---

## Security

- Two-Factor Authentication (2FA)
- Login history
- Session management
- Password expiration
- Email verification
- Security notifications

---

## Administration

- Admin profile pictures
- Admin notifications
- Audit log filters
- Advanced activity search
- Permission templates
- Multi-role support

---

## Performance

- Redis caching
- Image lazy loading
- CDN optimization
- Database indexing improvements
- API response caching

---

# Contributing

This repository is currently maintained as a private project.

Development follows a feature-based workflow.

Recommended workflow:

1. Create a feature branch
2. Implement the feature
3. Test locally
4. Open a Pull Request
5. Perform code review
6. Merge into the main branch

Example:

```bash
git checkout -b feature/new-module

git add .

git commit -m "Add new module"

git push origin feature/new-module
```

---

# Development Principles

The project follows these principles:

- Clean Architecture
- Modular Structure
- Separation of Concerns
- Type Safety
- Reusable Components
- RESTful APIs
- Secure Defaults
- Scalable Design
- Maintainable Code

Whenever possible:

- Business logic lives in services
- Controllers remain thin
- Validation happens before persistence
- Authentication and authorization are centralized
- Media uploads are isolated from business logic

---

# Browser Support

The frontend supports all modern browsers, including:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

Older browsers that do not support modern JavaScript features are not officially supported.

---

# License

This project is currently **private**.

All rights reserved.

Unauthorized copying, distribution, modification or commercial use of this project is prohibited without the permission of the project owner.

---

# Author

**Ayham Alaa Eddin**

Full-Stack Web Developer

Technologies used in this project include:

- React
- TypeScript
- Node.js
- Express
- MongoDB
- Mongoose
- Cloudinary
- Tailwind CSS
- JWT Authentication
- GitHub Actions
- Vercel
- Render

---

# Acknowledgements

Special thanks to the open-source community and the maintainers of the technologies that made this project possible.

Main technologies and services used:

- React
- Vite
- TypeScript
- Express
- MongoDB Atlas
- Mongoose
- Cloudinary
- Tailwind CSS
- GitHub Actions
- Render
- Vercel

---

# Project Status

Current status:

**Active Development**

The project is actively maintained and continuously improved with new features, performance optimizations, security enhancements and documentation updates.

---

# Additional Documentation

For more detailed information, please refer to the following documents included in this repository:

| Document          | Purpose                                  |
| ----------------- | ---------------------------------------- |
| **README.md**     | Project overview and getting started     |
| **API.md**        | Complete REST API reference              |
| **DEPLOYMENT.md** | Production deployment guide              |
| **BACKUP.md**     | MongoDB backup and disaster recovery     |
| **SECURITY.md**   | Security architecture and best practices |

---

# Quick Links

## Start Development

Backend

```bash
cd backend
npm install
npm run dev
```

Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Build Production

Backend

```bash
npm run build
npm start
```

Frontend

```bash
npm run build
```

---

## Database

Create Backup

```bash
npm run backup:mongo
```

Restore Backup

```bash
npm run restore:mongo backups/mongodb/backup-file.gz
```

---

# Final Notes

The **Collective Platform CMS** was designed to provide a modern, secure and scalable content management solution for cultural organizations, communities and event-based platforms.

Its modular architecture allows new features and modules to be added with minimal impact on the existing codebase.

With built-in role management, activity logging, automated backups, secure authentication and cloud-based media storage, the project provides a solid foundation for production deployments while remaining easy to extend and maintain.
````
