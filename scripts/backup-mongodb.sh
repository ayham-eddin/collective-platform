#!/bin/bash

set -e

BACKUP_DIR="backups/mongodb"
DATE=$(date +"%Y-%m-%d-%H-%M")
BACKUP_FILE="$BACKUP_DIR/backup-$DATE.gz"

mkdir -p "$BACKUP_DIR"

if [ -z "$MONGO_URI" ]; then
  echo "Error: MONGO_URI is not set."
  echo "Run:"
  echo 'export MONGO_URI="your-mongodb-uri"'
  exit 1
fi

mongodump \
  --uri="$MONGO_URI" \
  --gzip \
  --archive="$BACKUP_FILE"

echo "Backup created:"
echo "$BACKUP_FILE"