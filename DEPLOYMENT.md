# DEPLOYMENT.md

# Collective Platform CMS — Deployment Guide

This document describes how to deploy, configure and maintain the **Collective Platform CMS** in a production environment.

The deployment architecture separates the frontend, backend, database and media storage into independent services, allowing each component to scale independently and be maintained separately.

---

# Table of Contents

1. Architecture Overview
2. Project Structure
3. Requirements
4. Local Development
5. MongoDB Atlas Setup
6. Cloudinary Setup
7. Backend Deployment (Render)
8. Backend Environment Variables
9. Backend Health Check

---

# 1. Architecture Overview

The project uses the following production architecture:

```text
                       Internet
                           │
                           ▼
                  Custom Domain (GoDaddy)
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
      Vercel Frontend                Render Backend
     (React + Vite)               (Node.js + Express)
            │                             │
            │ REST API                    │
            └──────────────┬──────────────┘
                           ▼
                     MongoDB Atlas
                           │
                           ▼
                      Cloudinary
                  (Images & Videos)
```

Each service has a dedicated responsibility.

| Service        | Purpose                           |
| -------------- | --------------------------------- |
| Vercel         | Hosts the React frontend          |
| Render         | Hosts the Express backend         |
| MongoDB Atlas  | Stores application data           |
| Cloudinary     | Stores uploaded images and videos |
| GitHub         | Source code repository            |
| GitHub Actions | Automatic MongoDB backups         |
| Google Drive   | Off-site database backups         |

---

# 2. Project Structure

```text
collective-platform/
│
├── backend/
│   ├── src/
│   ├── scripts/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── vercel.json
│   └── .env
│
├── backups/
│
├── scripts/
│
├── .github/
│   └── workflows/
│
├── README.md
├── DEPLOYMENT.md
├── BACKUP.md
└── SECURITY.md
```

---

# 3. Requirements

Before deploying the application, make sure you have accounts for the following services:

| Service            | Required                    |
| ------------------ | --------------------------- |
| GitHub             | ✅                          |
| MongoDB Atlas      | ✅                          |
| Cloudinary         | ✅                          |
| Render             | ✅                          |
| Vercel             | ✅                          |
| GoDaddy (optional) | ✅ if using a custom domain |

Recommended software:

- Git
- Node.js LTS
- npm
- MongoDB Database Tools
- mongosh

---

# 4. Local Development

Clone the repository:

```bash
git clone https://github.com/your-username/collective-platform.git
```

Go into the project:

```bash
cd collective-platform
```

---

## Backend

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Start the development server:

```bash
npm run dev
```

The backend should be available at:

```text
http://localhost:5001
```

Verify the API:

```text
GET /api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Collective Platform API is running"
}
```

---

## Frontend

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:5001/api
```

Run:

```bash
npm run dev
```

The frontend should be available at:

```text
http://localhost:5173
```

---

# 5. MongoDB Atlas Setup

MongoDB Atlas stores all application data.

Collections include:

- Admins
- Roles
- Events
- Gallery Images
- Videos
- Team Members
- Contact Messages
- Activity Logs
- Home Content
- Site Settings

---

## 5.1 Create Cluster

1. Sign in to MongoDB Atlas.
2. Create a new Project.
3. Create a new Cluster.
4. The free M0 cluster is sufficient for development and small production websites.

---

## 5.2 Create Database User

Navigate to:

```
Database Access
```

Create a database user.

Recommended permissions:

```
Read and Write to Any Database
```

Use a strong password.

Example:

```
Username:
collective_admin

Password:
************
```

Never commit these credentials into Git.

---

## 5.3 Network Access

Navigate to:

```
Network Access
```

During development:

```
0.0.0.0/0
```

allows connections from anywhere.

For production, it is recommended to restrict access if possible.

---

## 5.4 Connection String

MongoDB Atlas provides a connection string similar to:

```text
mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
```

Add this value to the backend environment:

```env
MONGO_URI=mongodb+srv://...
```

The backend automatically connects on startup.

---

## 5.5 Verify Database

Open Mongo Shell:

```bash
mongosh "YOUR_MONGO_URI"
```

Show databases:

```javascript
show dbs
```

Select the project database:

```javascript
use test
```

Show collections:

```javascript
show collections
```

Expected collections:

```text
activitylogs
admins
contactmessages
events
galleryimages
homecontents
roles
sitesettings
teammembers
videos
```

---

# 6. Cloudinary Setup

Cloudinary is responsible for storing all uploaded media.

The CMS stores only the metadata:

- URL
- publicId

The actual files are hosted by Cloudinary.

---

## 6.1 Create Account

Create a Cloudinary account.

Open the Dashboard.

Copy:

```text
Cloud Name
API Key
API Secret
```

---

## 6.2 Backend Environment Variables

Add:

```env
CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

Never expose these values to the frontend.

---

## 6.3 Folder Structure

Recommended folders:

```text
collective/events

collective/gallery

collective/team

collective/videos
```

This keeps media organized inside Cloudinary.

---

## 6.4 Automatic Cleanup

The backend automatically deletes old Cloudinary assets when:

- an event image is replaced
- a gallery image is replaced
- a team member image is replaced
- an item is permanently deleted

This prevents orphaned files from accumulating inside Cloudinary.

---

# 7. Backend Deployment (Render)

The backend is deployed as a Render Web Service.

---

## 7.1 Push to GitHub

Before deployment:

```bash
git add .
git commit -m "Prepare production deployment"
git push origin main
```

---

## 7.2 Create Render Web Service

Open Render.

Choose:

```
New Web Service
```

Connect GitHub.

Select the project repository.

---

## 7.3 Build Settings

Configure:

```
Root Directory

backend
```

Environment:

```
Node
```

Build Command:

```bash
npm install
npm run build
```

Start Command:

```bash
npm start
```

Auto Deploy:

```
Enabled
```

This ensures every push to the selected branch automatically triggers a new deployment.

---

## 7.4 Render Port

The backend uses:

```typescript
process.env.PORT;
```

Render automatically injects the correct port.

Do **not** hardcode a production port.

For local development:

```env
PORT=5001
```

is recommended.

---

# 8. Backend Environment Variables

The following variables must be configured in Render.

```env
NODE_ENV=production

MONGO_URI=

CLIENT_URL=

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

Do not upload `.env` to GitHub.

All secrets should be configured through the Render dashboard.

---

# 9. Backend Health Check

After deployment, open:

```text
https://your-render-service.onrender.com/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Collective Platform API is running"
}
```

If this endpoint does not respond successfully:

- Check Render deployment logs.
- Verify environment variables.
- Verify MongoDB Atlas connection.
- Verify Cloudinary configuration.
- Ensure the application built successfully.

# 10. Frontend Deployment (Vercel)

The frontend is deployed using **Vercel**, which is optimized for React and Vite applications.

---

## 10.1 Push the Latest Changes

Before deploying, make sure your latest changes are committed.

```bash
git add .
git commit -m "Prepare frontend deployment"
git push origin main
```

---

## 10.2 Create a Vercel Project

1. Open Vercel.
2. Click **Add New Project**.
3. Import your GitHub repository.
4. Select the repository.

---

## 10.3 Configure the Project

Use the following settings:

### Framework Preset

```text
Vite
```

### Root Directory

```text
frontend
```

### Build Command

```bash
npm run build
```

### Output Directory

```text
dist
```

Leave the remaining settings at their defaults.

---

## 10.4 Frontend Environment Variables

Create the following variable inside the Vercel dashboard.

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

Example:

```env
VITE_API_URL=https://collective-platform-api.onrender.com/api
```

Remember:

Only variables beginning with `VITE_` are available inside React.

Never place secrets inside the frontend.

❌ Incorrect:

```env
JWT_SECRET=...
```

✅ Correct:

```env
VITE_API_URL=...
```

---

# 11. React Router Configuration

The frontend uses **React Router**.

Without additional configuration, refreshing pages such as

```text
/admin

/admin/login

/events/my-event

/gallery
```

would return **404 Not Found**.

---

## 11.1 Create `vercel.json`

Inside the frontend folder create:

```text
frontend/vercel.json
```

Content:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

This tells Vercel to always serve `index.html` so React Router can handle routing.

Without this file, refreshing nested routes will fail.

---

# 12. Connecting Frontend and Backend

```
Browser
   │
   ▼
Vercel Frontend
   │
REST API
   │
   ▼
Render Backend
   │
   ▼
MongoDB Atlas
   │
   ▼
Cloudinary
```

Every API request is sent to:

```text
VITE_API_URL
```

Example:

```http
GET https://your-backend.onrender.com/api/events
```

The backend communicates with MongoDB and Cloudinary.

---

# 13. CORS Configuration

The backend only accepts requests from the frontend.

Inside Render:

```env
CLIENT_URL=https://your-frontend.vercel.app
```

Example:

```env
CLIENT_URL=https://collective-platform.vercel.app
```

If using a custom domain:

```env
CLIENT_URL=https://collectiveplatform.com
```

Do **not** leave CORS open in production.

---

# 14. Using a Custom Domain

The project supports any custom domain.

Example:

```text
collectiveplatform.com
```

Purchased through:

- GoDaddy
- Namecheap
- Cloudflare
- Squarespace Domains

---

## 14.1 Add Domain to Vercel

Open:

```
Project
↓
Settings
↓
Domains
```

Add:

```text
yourdomain.com
```

Vercel will generate the required DNS records.

---

## 14.2 Configure GoDaddy DNS

### Root Domain

| Type | Host | Value       |
| ---- | ---- | ----------- |
| A    | @    | 76.76.21.21 |

### WWW

| Type  | Host | Value                |
| ----- | ---- | -------------------- |
| CNAME | www  | cname.vercel-dns.com |

Save the changes.

DNS propagation may take several hours.

---

## 14.3 SSL Certificate

After DNS verification, Vercel automatically provisions an SSL certificate.

The website becomes available through:

```text
https://
```

No manual SSL installation is required.

---

# 15. Production Deployment Flow

Whenever new features are completed:

```bash
git add .
git commit -m "Describe changes"
git push origin main
```

Deployment pipeline:

```
Git Push
    │
    ▼
GitHub
    │
    ├──────────────► Render (Backend)
    │
    └──────────────► Vercel (Frontend)
```

Both services automatically redeploy after every push to the production branch.

---

# 16. Render Free Plan

If using Render's free plan:

The backend automatically sleeps after inactivity.

The first request after sleeping may take approximately:

```text
30–60 seconds
```

Possible symptoms:

- Slow first page load
- Slow login
- Slow API response

This is expected behavior for the free tier.

For commercial deployments, upgrading to a paid Render plan is recommended.

---

# 17. Production Verification Checklist

After every deployment verify:

## Backend

Open:

```text
/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Collective Platform API is running"
}
```

---

## Authentication

Verify:

- Super Admin login
- Admin login
- Logout
- JWT authentication
- Protected routes

---

## Events

Verify:

- Create event
- Edit event
- Delete event
- Upload cover image
- Event details page

---

## Gallery

Verify:

- Upload image
- Replace image
- Delete image

---

## Videos

Verify:

- Create video
- Edit video
- Delete video

---

## Team

Verify:

- Create member
- Edit member
- Delete member

---

## Contact

Verify:

- Contact form submission
- Messages appear in Admin Panel

---

## Permissions

Verify:

### Super Admin

- Full access
- Manage Admins
- Manage Roles
- View Activity Logs

### Normal Admin

- Access only allowed modules
- Activity Logs hidden

---

## Cloudinary

Verify:

- Upload succeeds
- Old assets are deleted after replacement
- Deleted items remove Cloudinary resources

---

# 18. Updating Environment Variables

If backend environment variables change:

```
Render
↓
Environment
↓
Edit Variables
↓
Save
↓
Redeploy
```

For Vercel:

```
Project
↓
Settings
↓
Environment Variables
↓
Redeploy
```

Environment variable changes require a new deployment before they become active.

---

# 19. Common Deployment Problems

## Backend Returns HTTP 500

Check:

- MongoDB URI
- Cloudinary credentials
- JWT secrets
- Render deployment logs

---

## Frontend Cannot Reach Backend

Verify:

```env
VITE_API_URL
```

Verify:

```env
CLIENT_URL
```

Also check the browser console for CORS errors.

---

## Login Always Fails

Verify:

- Admin account exists
- Password is correct
- JWT secrets are configured
- MongoDB connection works

---

## Image Upload Fails

Verify:

```env
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

---

## Refresh Returns 404

Verify:

```text
frontend/vercel.json
```

exists and contains the React Router rewrite configuration.

---

## Render Deployment Fails

Run locally first:

```bash
npm run build
```

Resolve all TypeScript errors before pushing.

Also verify:

```text
Root Directory

backend
```

inside the Render project configuration.

---

# 20. Backup Strategy

Protecting the database is one of the most important parts of operating the CMS.

The project includes multiple backup layers to minimize the risk of data loss.

Current backup strategy:

- Local backup script
- Local restore script
- GitHub Actions automatic backups
- GitHub Artifacts (60 days retention)
- Optional Google Drive off-site backups

For detailed instructions, see:

```text
BACKUP.md
```

---

## 20.1 Local Backup

Create a backup manually:

```bash
npm run backup:mongo
```

This creates a compressed backup inside:

```text
backups/mongodb/
```

Example:

```text
backup-2026-06-28-15-53.gz
```

---

## 20.2 Local Restore

Restore a backup:

```bash
npm run restore:mongo -- backups/mongodb/backup-YYYY-MM-DD-HH-MM.gz
```

The restore script asks for confirmation before replacing the database.

---

## 20.3 Automatic GitHub Backups

GitHub Actions automatically creates MongoDB backups.

The workflow:

- Creates a MongoDB dump
- Compresses the archive
- Uploads it as a GitHub Artifact

Retention:

```text
60 days
```

This provides disaster recovery even if the local computer is unavailable.

---

## 20.4 Off-site Backup

Optionally, backups can also be uploaded automatically to Google Drive using **rclone**.

This provides protection against:

- Laptop failure
- Disk corruption
- Lost backups
- Accidental deletion

---

# 21. Rollback Strategy

If a deployment introduces a critical issue, follow this rollback process.

---

## Backend

Render keeps previous deployments.

Rollback steps:

1. Open Render Dashboard
2. Select the Web Service
3. Open Deploys
4. Select the previous successful deployment
5. Click **Rollback**

---

## Frontend

Vercel stores every deployment.

Rollback steps:

1. Open Vercel
2. Open Deployments
3. Select the previous deployment
4. Click **Promote to Production**

---

## Database

If data corruption occurs:

1. Stop the backend.
2. Restore the latest MongoDB backup.
3. Verify collections.
4. Restart the backend.
5. Verify application functionality.

---

# 22. Security Recommendations

Never expose:

- MongoDB credentials
- JWT secrets
- Cloudinary API Secret
- Environment files
- Backup archives

---

## Passwords

Use strong passwords for:

- MongoDB Atlas
- Render
- Vercel
- Cloudinary
- GitHub

Enable Two-Factor Authentication whenever possible.

---

## Environment Variables

Never commit:

```text
backend/.env
frontend/.env
```

Use the deployment platform's secret management instead.

---

## Git Ignore

The repository should ignore:

```gitignore
.env
.env.*
backups/
node_modules/
dist/
coverage/
```

---

## HTTPS

Always use HTTPS in production.

Do not allow insecure HTTP API endpoints.

---

## CORS

Only allow requests from the production frontend.

Example:

```env
CLIENT_URL=https://collectiveplatform.com
```

---

# 23. Monitoring

Regularly monitor:

- Render deployment logs
- MongoDB Atlas metrics
- Cloudinary usage
- GitHub Actions workflow status
- Application Activity Logs

These tools help identify issues before users report them.

---

# 24. Maintenance Schedule

## Daily

- Verify the website is online.
- Check GitHub backup workflow.
- Check contact messages.

---

## Weekly

- Review Activity Logs.
- Remove unused media.
- Review failed deployments.

---

## Monthly

- Verify MongoDB backups.
- Test backup restoration.
- Update dependencies.
- Review admin accounts and permissions.

---

# 25. Updating Dependencies

Backend:

```bash
cd backend
npm outdated
npm update
```

Frontend:

```bash
cd frontend
npm outdated
npm update
```

After updating:

```bash
npm run build
```

Verify that everything still builds successfully before deploying.

---

# 26. Logging

The CMS includes:

- Request logging
- Error handling
- Activity logging

Activity logs record:

- Admin
- Action
- Module
- Date
- Status
- Target item

Only Super Admin users can access Activity Logs.

---

# 27. Production Best Practices

Before every deployment:

- Create a MongoDB backup.
- Verify GitHub Actions completed successfully.
- Test locally.
- Run TypeScript build.
- Commit changes.
- Push to GitHub.

After deployment:

- Verify API health.
- Verify frontend.
- Verify login.
- Verify uploads.
- Verify database connection.

---

# 28. Production Checklist

Before delivering the project to a client, verify:

## Infrastructure

- Backend deployed
- Frontend deployed
- MongoDB Atlas connected
- Cloudinary connected
- Custom domain configured
- HTTPS enabled

---

## CMS

- Super Admin created
- Roles configured
- Admin permissions tested
- Activity Logs working
- Dashboard working

---

## Content

- Events working
- Gallery working
- Videos working
- Team working
- Home Content working
- Contact form working

---

## Uploads

- Image upload
- Video upload
- Image replacement
- Automatic Cloudinary cleanup

---

## Security

- JWT secrets configured
- Environment variables secured
- CORS configured
- Admin authentication tested

---

## Backups

- Local backup tested
- Restore tested
- GitHub Actions backup working
- Backup artifacts available
- Google Drive backup (optional)

---

# 29. Future Improvements

Recommended future enhancements:

- Redis caching
- CDN optimization
- Email notifications
- Multi-factor authentication (MFA)
- Audit log filtering
- Advanced analytics dashboard
- Search functionality
- Event scheduling
- Multi-tenant support
- Docker deployment
- Kubernetes support
- CI/CD testing pipeline
- Automated dependency updates

---

# 30. Final Architecture

```text
                     Users
                       │
                       ▼
             Custom Domain (GoDaddy)
                       │
          HTTPS + SSL (Vercel)
                       │
                       ▼
            React Frontend (Vite)
                       │
                  REST API
                       │
                       ▼
          Express Backend (Render)
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
 MongoDB Atlas                 Cloudinary
(Database Storage)           (Media Storage)
         │
         ▼
 GitHub Actions
         │
         ▼
Automatic MongoDB Backups
         │
         ▼
GitHub Artifacts (60 days)
         │
         ▼
Google Drive (Optional)
```

---

# 31. Conclusion

The Collective Platform CMS is designed with a modern, scalable architecture that separates responsibilities across specialized services.

Frontend, backend, database, media storage, backups, and deployment pipelines are all independent, making the platform easier to maintain, extend, and scale.

By following this deployment guide and the accompanying **BACKUP.md**, the system can be deployed, maintained, restored, and updated with confidence while minimizing downtime and reducing the risk of data loss.
