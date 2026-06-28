#!/bin/bash

set -e

ENV_FILE="backend/.env"
BACKUP_DIR="backups/mongodb"
DRIVE_REMOTE="gdrive:MongoDB-Backups"
DATE=$(date +"%Y-%m-%d-%H-%M")
BACKUP_FILE="$BACKUP_DIR/backup-$DATE.gz"

mkdir -p "$BACKUP_DIR"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found."
  exit 1
fi

MONGO_URI=$(grep "^MONGO_URI=" "$ENV_FILE" | cut -d "=" -f2-)

if [ -z "$MONGO_URI" ]; then
  echo "Error: MONGO_URI not found in $ENV_FILE."
  exit 1
fi

echo "Creating MongoDB backup..."

mongodump \
  --uri="$MONGO_URI" \
  --gzip \
  --archive="$BACKUP_FILE"

echo "Uploading backup to Google Drive..."

rclone mkdir "$DRIVE_REMOTE"

rclone copy "$BACKUP_FILE" "$DRIVE_REMOTE"

echo "Cleaning Google Drive backups older than 60 days..."

rclone delete "$DRIVE_REMOTE" --min-age 60d

echo "Backup completed successfully:"
echo "$BACKUP_FILE"
echo "Uploaded to:"
echo "$DRIVE_REMOTE"