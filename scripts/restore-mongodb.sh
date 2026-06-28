#!/bin/bash

set -e

ENV_FILE="backend/.env"
BACKUP_DIR="backups/mongodb"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE not found."
  exit 1
fi

MONGO_URI=$(grep "^MONGO_URI=" "$ENV_FILE" | cut -d "=" -f2-)

if [ -z "$MONGO_URI" ]; then
  echo "Error: MONGO_URI not found in $ENV_FILE."
  exit 1
fi

if [ -z "$1" ]; then
  echo "Error: Please provide a backup file."
  echo "Example:"
  echo "./scripts/restore-mongodb.sh backups/mongodb/backup-2026-06-28-15-53.gz"
  exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "WARNING: This will restore MongoDB from:"
echo "$BACKUP_FILE"
echo ""
echo "Target database from backend/.env:"
echo "$MONGO_URI"
echo ""
read -p "Type RESTORE to continue: " CONFIRMATION

if [ "$CONFIRMATION" != "RESTORE" ]; then
  echo "Restore cancelled."
  exit 1
fi

mongorestore \
  --uri="$MONGO_URI" \
  --gzip \
  --archive="$BACKUP_FILE" \
  --drop

echo "Restore completed successfully."