# MongoDB Backup & Restore Guide

This document explains the backup and restore strategy for the Collective Platform CMS.

The goal of this system is to protect the MongoDB Atlas database from accidental deletion, account issues, data corruption, or failed deployments.

---

# 1. Backup Overview

The project uses a multi-layer MongoDB backup strategy.

Backups are stored in three places:

1. Local backups on the developer machine
2. GitHub Actions artifacts
3. Google Drive off-site backups

This gives the project protection even if:

- MongoDB Atlas access is lost
- The Atlas cluster is deleted
- The local laptop is unavailable
- A bad deployment damages database content
- Data is accidentally deleted from the CMS

---

# 2. What Is Backed Up?

The backup includes all MongoDB collections used by the CMS.

Current collections include:

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

The backup includes database records only.

Images and videos uploaded to Cloudinary are not stored inside MongoDB. MongoDB stores only metadata such as:

```json
{
  "url": "https://res.cloudinary.com/...",
  "publicId": "folder/image-id"
}
```

Cloudinary assets should be backed up separately if long-term media protection is required.

---

# 3. Local Backup

Local backups are created with the script:

```bash
npm run backup:mongo
```

This script reads the MongoDB connection string from:

```text
backend/.env
```

It uses:

```env
MONGO_URI=
```

The generated backup file is stored in:

```text
backups/mongodb
```

Example backup filename:

```text
backup-2026-06-28-15-53.gz
```

---

# 4. Local Backup Script

The local backup script is located at:

```text
scripts/backup-mongodb.sh
```

It performs the following steps:

1. Reads `MONGO_URI` from `backend/.env`
2. Creates the folder `backups/mongodb`
3. Runs `mongodump`
4. Compresses the backup using gzip
5. Creates a timestamped `.gz` archive
6. Optionally uploads the backup to Google Drive if rclone is configured

Example command used internally:

```bash
mongodump \
  --uri="$MONGO_URI" \
  --gzip \
  --archive="$BACKUP_FILE"
```

---

# 5. Restore

A restore script is available at:

```text
scripts/restore-mongodb.sh
```

It can restore a `.gz` backup file into MongoDB Atlas.

Run:

```bash
npm run restore:mongo -- backups/mongodb/backup-file.gz
```

Example:

```bash
npm run restore:mongo -- backups/mongodb/backup-2026-06-28-15-53.gz
```

The script asks for confirmation before restoring.

You must type:

```text
RESTORE
```

before the restore begins.

---

# 6. Important Restore Warning

The restore script uses:

```bash
--drop
```

This means existing collections will be deleted before the backup data is restored.

This is intentional.

It ensures the database state exactly matches the selected backup.

Do not run restore unless you are sure you want to replace the current database data.

---

# 7. Restore Script Behavior

The restore script does the following:

1. Reads `MONGO_URI` from `backend/.env`
2. Checks that the backup file exists
3. Prints a warning
4. Requires manual confirmation
5. Runs `mongorestore`
6. Drops existing collections
7. Restores the backup archive
8. Restores indexes

Example internal command:

```bash
mongorestore \
  --uri="$MONGO_URI" \
  --gzip \
  --archive="$BACKUP_FILE" \
  --drop
```

A successful restore should end with something similar to:

```text
61 document(s) restored successfully. 0 document(s) failed to restore.
Restore completed successfully.
```

---

# 8. GitHub Actions Backup

Automatic backups are created using GitHub Actions.

Workflow file:

```text
.github/workflows/mongodb-backup.yml
```

The workflow runs:

- Manually using `workflow_dispatch`
- Automatically every day using a cron schedule

Current schedule:

```yaml
schedule:
  - cron: "0 2 * * *"
```

This runs every day at 02:00 UTC.

In Germany this is approximately:

- 03:00 during winter time
- 04:00 during summer time

---

# 9. GitHub Actions Secrets

The workflow requires GitHub repository secrets.

Go to:

```text
GitHub Repository
→ Settings
→ Secrets and variables
→ Actions
→ Repository secrets
```

Required secrets:

```text
MONGO_URI
RCLONE_CONFIG
```

## MONGO_URI

This is the MongoDB Atlas connection string.

Example format:

```text
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?appName=Cluster0
```

Never commit this value to GitHub.

## RCLONE_CONFIG

This contains the rclone Google Drive configuration.

It allows GitHub Actions to upload backup files to Google Drive.

This value must also never be committed to GitHub.

---

# 10. GitHub Artifact Backup

Each GitHub Actions backup is uploaded as a GitHub artifact.

Artifact name:

```text
mongodb-backup
```

Artifact retention:

```yaml
retention-days: 60
```

This means GitHub keeps each backup artifact for 60 days.

Artifacts can be downloaded from:

```text
GitHub Repository
→ Actions
→ MongoDB Backup
→ Select workflow run
→ Artifacts
```

GitHub artifacts are useful as an additional temporary backup layer.

They are not meant to be the only long-term backup location.

---

# 11. Google Drive Backup

Backups are also uploaded to Google Drive using rclone.

Remote name:

```text
gdrive
```

Google Drive folder:

```text
MongoDB-Backups
```

Example backup structure:

```text
MongoDB-Backups/
├── backup-2026-06-28-15-53.gz
├── backup-2026-06-29-02-00.gz
├── backup-2026-06-30-02-00.gz
```

Each backup has a unique timestamped filename.

This means new backups do not overwrite older backups.

---

# 12. Google Drive Retention

Old Google Drive backups can be deleted automatically using rclone.

Example:

```bash
rclone delete gdrive:MongoDB-Backups --min-age 60d
```

This removes backups older than 60 days.

If this step is enabled inside GitHub Actions, Google Drive will keep only recent backups.

Recommended retention:

```text
60 to 90 days
```

For small projects, keeping longer backups is also acceptable because MongoDB dump files are usually small.

---

# 13. Manual Google Drive Upload

To manually upload a backup to Google Drive:

```bash
rclone copy backups/mongodb/backup-file.gz gdrive:MongoDB-Backups
```

Example:

```bash
rclone copy backups/mongodb/backup-2026-06-28-15-53.gz gdrive:MongoDB-Backups
```

Verify upload:

```bash
rclone ls gdrive:MongoDB-Backups
```

---

# 14. Manual Google Drive Download

To download a backup from Google Drive:

```bash
rclone copy gdrive:MongoDB-Backups/backup-file.gz backups/mongodb
```

Example:

```bash
rclone copy gdrive:MongoDB-Backups/backup-2026-06-28-15-53.gz backups/mongodb
```

Then restore:

```bash
npm run restore:mongo -- backups/mongodb/backup-2026-06-28-15-53.gz
```

---

# 15. Disaster Recovery Procedure

Use this procedure if the database is lost or corrupted.

## Step 1: Find the latest valid backup

Check Google Drive:

```text
MongoDB-Backups
```

Or check GitHub Actions artifacts.

## Step 2: Download the backup

Using rclone:

```bash
rclone copy gdrive:MongoDB-Backups/backup-file.gz backups/mongodb
```

Or manually download it from Google Drive and place it in:

```text
backups/mongodb
```

## Step 3: Restore the backup

```bash
npm run restore:mongo -- backups/mongodb/backup-file.gz
```

## Step 4: Confirm restore

Check MongoDB Atlas collections.

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

## Step 5: Restart backend

If needed, restart the Render backend service.

## Step 6: Test the website

Check:

- Public home page
- Events page
- Gallery page
- Videos page
- Admin login
- Admin dashboard
- CRUD operations

---

# 16. Verifying a Backup

A backup can be verified with:

```bash
mongorestore \
  --gzip \
  --archive="backups/mongodb/backup-file.gz" \
  --dryRun
```

A successful dry run should finish without archive errors.

Note:

If using `--dryRun`, no data is actually restored.

---

# 17. Checking Database Collections

Connect to MongoDB:

```bash
mongosh "YOUR_MONGO_URI"
```

Show databases:

```javascript
show dbs
```

Use the project database:

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

# 18. Important Security Notes

Never commit these files or values:

```text
backend/.env
~/.config/rclone/rclone.conf
MongoDB connection string
Google OAuth token
RCLONE_CONFIG
Backup files containing real data
```

The following folder must stay ignored by Git:

```text
backups/
```

Make sure `.gitignore` contains:

```gitignore
backups/
```

---

# 19. rclone Security

rclone uses OAuth tokens to access Google Drive.

If the rclone token is ever exposed:

1. Go to Google Account Security
2. Open third-party app access
3. Remove rclone access
4. Run `rclone config` again
5. Generate a new config
6. Update the GitHub secret `RCLONE_CONFIG`

For production, it is recommended to use a dedicated Google account only for backups.

Example:

```text
collective.backups@gmail.com
```

This keeps project backups separate from personal Google Drive data.

---

# 20. Recommended Backup Policy

Recommended production policy:

```text
Daily backup:
- GitHub Actions
- Google Drive upload
- GitHub artifact

Retention:
- GitHub artifact: 60 days
- Google Drive: 60-90 days or longer

Manual backup:
- Before large releases
- Before database migrations
- Before major admin changes

Restore test:
- Once per month
```

---

# 21. When To Create a Manual Backup

Run a manual backup before:

- Deploying large changes
- Changing database models
- Editing roles or permissions
- Testing destructive delete functionality
- Cleaning Cloudinary assets
- Importing large content
- Giving admin access to a new person

Command:

```bash
npm run backup:mongo
```

---

# 22. Common Problems

## Problem: Backup runs locally but not in GitHub Actions

Check:

- `MONGO_URI` secret exists
- MongoDB Atlas allows access from GitHub Actions
- The workflow installed MongoDB Database Tools correctly
- The connection string is correct

## Problem: Backup appears in GitHub but not Google Drive

Check:

- `RCLONE_CONFIG` secret exists
- rclone config contains `[gdrive]`
- The workflow includes the rclone upload step
- Google Drive authorization has not been revoked

## Problem: Restore fails because of version warning

MongoDB tools may show cross-version warnings.

A warning is not always fatal.

Check whether documents were restored successfully.

## Problem: Backup file is small

This is normal.

Images are stored in Cloudinary, not MongoDB.

MongoDB stores only text data and media metadata.

## Problem: rclone permission expired

Re-authenticate:

```bash
rclone config
```

Then update:

```text
GitHub Secret: RCLONE_CONFIG
```

---

# 23. Current Backup Architecture

```text
MongoDB Atlas
      |
      v
GitHub Actions
      |
      |-- GitHub Artifact backup
      |
      v
Google Drive
      |
      v
MongoDB-Backups folder
```

Local backup and restore scripts are also available for manual use.

---

# 24. Current Status

The backup system is functional and tested.

Tested successfully:

- Local backup
- Local restore
- GitHub Actions backup
- GitHub artifact upload
- Google Drive upload
- rclone authentication
- restore with `mongorestore --drop`

The system is ready for production use.
