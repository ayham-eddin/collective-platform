# API.md

# Collective Platform CMS — API Documentation

This document describes the backend API for the Collective Platform CMS.

The backend is built with:

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Role-Based Access Control

---

# 1. Base URL

## Local Development

```text
http://localhost:5001/api
```

## Production

```text
https://your-render-backend.onrender.com/api
```

Example:

```text
https://collective-platform-api.onrender.com/api
```

---

# 2. Authentication

Admin-only endpoints require a JWT access token.

The token must be sent in the `Authorization` header.

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Example:

```http
GET /api/admins
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

# 3. Common Response Format

Most successful responses follow this structure:

```json
{
  "success": true,
  "data": {}
}
```

Some write operations also include a message:

```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {}
}
```

---

# 4. Common Error Format

Errors follow this structure:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

# 5. Common Status Codes

| Status Code | Meaning               |
| ----------- | --------------------- |
| 200         | Request successful    |
| 201         | Resource created      |
| 400         | Bad request           |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Not found             |
| 429         | Too many requests     |
| 500         | Internal server error |

---

# 6. Pagination Format

Paginated endpoints return:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 100,
    "totalPages": 10
  }
}
```

Common query parameters:

| Query  | Type   | Description    |
| ------ | ------ | -------------- |
| page   | number | Current page   |
| limit  | number | Items per page |
| search | string | Search keyword |

---

# 7. Localized Text Format

Many CMS fields support German, English and Arabic.

```json
{
  "de": "German text",
  "en": "English text",
  "ar": "Arabic text"
}
```

This format is used for:

- titles
- descriptions
- locations
- image alt text
- video titles
- website content

---

# 8. Permissions

Admin endpoints are protected by permission middleware.

Permission format:

```json
{
  "module": "events",
  "actions": ["read", "create", "update", "delete"]
}
```

Supported actions:

```text
read
create
update
delete
publish
```

Super Admin bypasses permission checks.

---

# 9. Endpoint Overview

| Module         | Base Path            |
| -------------- | -------------------- |
| Auth           | `/api/auth`          |
| Admins & Roles | `/api/admins`        |
| Events         | `/api/events`        |
| Gallery        | `/api/gallery`       |
| Uploads        | `/api/uploads`       |
| Videos         | `/api/videos`        |
| Team           | `/api/team`          |
| Home Content   | `/api/home-content`  |
| Settings       | `/api/settings`      |
| Contact        | `/api/contact`       |
| Dashboard      | `/api/dashboard`     |
| Activity Logs  | `/api/activity-logs` |

---

# 10. Health Check

## GET `/api/health`

Checks whether the backend API is running.

### Access

Public

### Response

```json
{
  "success": true,
  "message": "Collective Platform API is running"
}
```

---

# 11. Auth API

Base path:

```text
/api/auth
```

---

## 11.1 Auth Status

### GET `/api/auth/status`

Checks whether the auth module is available.

### Access

Public

### Response

```json
{
  "success": true,
  "message": "Auth module is ready"
}
```

---

## 11.2 Login

### POST `/api/auth/login`

Logs in an admin user.

### Access

Public

### Request Body

```json
{
  "email": "admin@example.com",
  "password": "your-password"
}
```

### Validation

Required fields:

- email
- password

If missing:

```json
{
  "success": false,
  "message": "Email and password are required"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "_id": "adminId",
      "email": "admin@example.com",
      "fullName": "Super Admin",
      "role": {
        "_id": "roleId",
        "name": "Super Admin",
        "isSuperAdmin": true,
        "permissions": []
      },
      "isActive": true
    },
    "accessToken": "jwt-token"
  }
}
```

---

## 11.3 Current Authenticated Admin

### GET `/api/auth/me`

Checks if the request is authenticated.

### Access

Authenticated Admin

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Response

```json
{
  "success": true,
  "message": "Authenticated"
}
```

---

# 12. Dashboard API

Base path:

```text
/api/dashboard
```

---

## 12.1 Get Dashboard Stats

### GET `/api/dashboard/admin/stats`

Returns dashboard statistics for the admin panel.

### Access

Authenticated Admin

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Response

```json
{
  "success": true,
  "data": {
    "totalEvents": 10,
    "publishedEvents": 8,
    "galleryImages": 9,
    "videos": 4,
    "teamMembers": 5,
    "unreadMessages": 2
  }
}
```

---

# 13. Admins & Roles API

Base path:

```text
/api/admins
```

This module manages administrator accounts and roles.

Most endpoints require the `admins` permission.

Super Admin should usually be the only account allowed to manage admins and roles.

---

## 13.1 Admin Module Status

### GET `/api/admins/status`

Checks whether the admin module is available.

### Access

Public

### Response

```json
{
  "success": true,
  "message": "Admin module is ready"
}
```

---

## 13.2 Protected Profile Test

### GET `/api/admins/profile`

Test endpoint for authenticated admin access.

### Access

Authenticated Admin

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Response

```json
{
  "success": true,
  "message": "Protected route works"
}
```

---

# 14. Roles

---

## 14.1 Get Roles

### GET `/api/admins/roles`

Returns all roles.

### Access

Admin

### Required Permission

```text
admins:read
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "roleId",
      "name": "Event Manager",
      "isSuperAdmin": false,
      "permissions": [
        {
          "module": "events",
          "actions": ["read", "create", "update"]
        }
      ]
    }
  ]
}
```

---

## 14.2 Create Role

### POST `/api/admins/roles`

Creates a new role.

### Access

Admin

### Required Permission

```text
admins:create
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Request Body

```json
{
  "name": "Gallery Manager",
  "permissions": [
    {
      "module": "gallery",
      "actions": ["read", "create", "update", "delete"]
    }
  ]
}
```

### Required Fields

- name

### Success Response

```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "_id": "roleId",
    "name": "Gallery Manager",
    "isSuperAdmin": false,
    "permissions": [
      {
        "module": "gallery",
        "actions": ["read", "create", "update", "delete"]
      }
    ]
  }
}
```

### Missing Name Response

```json
{
  "success": false,
  "message": "Role name is required"
}
```

---

## 14.3 Update Role

### PUT `/api/admins/roles/:id`

Updates an existing role.

### Access

Admin

### Required Permission

```text
admins:update
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### URL Params

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | string | Role ID     |

### Request Body

```json
{
  "name": "Content Manager",
  "permissions": [
    {
      "module": "events",
      "actions": ["read", "create", "update"]
    },
    {
      "module": "gallery",
      "actions": ["read", "create", "update"]
    }
  ]
}
```

### Success Response

```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "_id": "roleId",
    "name": "Content Manager",
    "permissions": []
  }
}
```

---

## 14.4 Delete Role

### DELETE `/api/admins/roles/:id`

Deletes a role.

### Access

Admin

### Required Permission

```text
admins:delete
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### URL Params

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | string | Role ID     |

### Success Response

```json
{
  "success": true,
  "message": "Role deleted successfully",
  "data": {
    "_id": "roleId",
    "name": "Old Role"
  }
}
```

---

# 15. Admin Users

---

## 15.1 Get Admins

### GET `/api/admins`

Returns all admin users.

### Access

Admin

### Required Permission

```text
admins:read
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "adminId",
      "email": "admin@example.com",
      "fullName": "Admin User",
      "role": {
        "_id": "roleId",
        "name": "Event Manager"
      },
      "isActive": true,
      "lastLoginAt": "2026-06-28T12:00:00.000Z"
    }
  ]
}
```

---

## 15.2 Create Admin

### POST `/api/admins`

Creates a new admin user.

### Access

Admin

### Required Permission

```text
admins:create
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Request Body

```json
{
  "email": "new-admin@example.com",
  "password": "StrongPassword123!",
  "fullName": "New Admin",
  "roleId": "roleId"
}
```

### Required Fields

- email
- password
- fullName
- roleId

### Success Response

```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "_id": "adminId",
    "email": "new-admin@example.com",
    "fullName": "New Admin",
    "role": "roleId",
    "isActive": true
  }
}
```

### Missing Fields Response

```json
{
  "success": false,
  "message": "Email, password, full name and role are required"
}
```

---

## 15.3 Update Admin

### PUT `/api/admins/:id`

Updates an existing admin user.

### Access

Admin

### Required Permission

```text
admins:update
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### URL Params

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | string | Admin ID    |

### Request Body

```json
{
  "email": "updated@example.com",
  "fullName": "Updated Admin",
  "roleId": "roleId",
  "isActive": true
}
```

### Success Response

```json
{
  "success": true,
  "message": "Admin updated successfully",
  "data": {
    "_id": "adminId",
    "email": "updated@example.com",
    "fullName": "Updated Admin",
    "isActive": true
  }
}
```

---

## 15.4 Delete Admin

### DELETE `/api/admins/:id`

Deletes or deactivates an admin depending on the service implementation.

### Access

Admin

### Required Permission

```text
admins:delete
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### URL Params

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | string | Admin ID    |

### Success Response

```json
{
  "success": true,
  "message": "Admin deleted successfully",
  "data": {
    "_id": "adminId",
    "email": "old-admin@example.com"
  }
}
```

---

# 16. Activity Logs API

Base path:

```text
/api/activity-logs
```

Activity Logs are visible only to Super Admin.

---

## 16.1 Get Activity Logs

### GET `/api/activity-logs/admin`

Returns admin activity logs.

### Access

Super Admin only

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Query Parameters

| Query | Type   | Default | Description    |
| ----- | ------ | ------- | -------------- |
| page  | number | 1       | Current page   |
| limit | number | 20      | Items per page |

### Example

```http
GET /api/activity-logs/admin?page=1&limit=20
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "logId",
      "adminId": {
        "_id": "adminId",
        "fullName": "Super Admin",
        "email": "admin@example.com"
      },
      "action": "update",
      "module": "events",
      "method": "PUT",
      "path": "/api/events/admin/eventId",
      "statusCode": 200,
      "targetId": "eventId",
      "targetTitle": "Summer Festival",
      "createdAt": "2026-06-28T12:00:00.000Z",
      "updatedAt": "2026-06-28T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 13,
    "totalPages": 1
  }
}
```

---

# 17. End of Part 1

This part documented:

- base URL
- authentication
- common response formats
- pagination
- permissions
- health check
- auth endpoints
- dashboard endpoint
- admin users
- roles
- activity logs

Next part should document:

- Events API
- Public Events
- Admin Events
- Event grouped endpoint
- Event request body
- Event update/delete behavior

---

# 18. Events API

Base path:

```text
/api/events
```

The Events API manages public and admin event data.

Events can contain:

- localized title
- localized short description
- localized full description
- slug
- cover image
- gallery images
- event date
- start time
- end time
- location
- Google Maps URL
- ticket URL
- lineup
- category
- videos
- status
- featured flag

---

# 19. Event Object

Example event object:

```json
{
  "_id": "eventId",
  "title": {
    "de": "Sommer Festival",
    "en": "Summer Festival",
    "ar": "مهرجان الصيف"
  },
  "slug": "summer-festival",
  "shortDescription": {
    "de": "Kurze Beschreibung",
    "en": "Short description",
    "ar": "وصف قصير"
  },
  "description": {
    "de": "Lange Beschreibung",
    "en": "Long description",
    "ar": "وصف طويل"
  },
  "coverImage": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "collective/events/image-id",
    "alt": {
      "de": "Sommer Festival",
      "en": "Summer Festival",
      "ar": "مهرجان الصيف"
    }
  },
  "galleryImages": [],
  "videos": [
    {
      "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
      "title": {
        "de": "Video Titel",
        "en": "Video Title",
        "ar": "عنوان الفيديو"
      },
      "description": {
        "de": "Video Beschreibung",
        "en": "Video description",
        "ar": "وصف الفيديو"
      }
    }
  ],
  "eventDate": "2026-07-15T00:00:00.000Z",
  "startTime": "20:00",
  "endTime": "23:00",
  "location": {
    "de": "Düsseldorf",
    "en": "Düsseldorf",
    "ar": "دوسلدورف"
  },
  "googleMapsUrl": "https://maps.google.com/...",
  "ticketUrl": "https://tickets.example.com",
  "lineup": ["Artist One", "Artist Two"],
  "category": "Festival",
  "status": "published",
  "isFeatured": true,
  "isDeleted": false,
  "createdAt": "2026-06-28T12:00:00.000Z",
  "updatedAt": "2026-06-28T12:00:00.000Z"
}
```

---

# 20. Event Status

Supported event statuses:

```text
draft
published
archived
```

Only events with:

```text
status = published
```

are returned by public endpoints.

---

# 21. Public Events

Public event endpoints do not require authentication.

They are used by the public website.

---

## 21.1 Get Public Events

### GET `/api/events/public`

Returns published events.

### Access

Public

### Query Parameters

| Query  | Type   | Default | Description    |
| ------ | ------ | ------- | -------------- |
| page   | number | 1       | Current page   |
| limit  | number | 50      | Items per page |
| search | string | empty   | Search keyword |

### Example

```http
GET /api/events/public?page=1&limit=6&search=festival
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "eventId",
      "title": {
        "de": "Sommer Festival",
        "en": "Summer Festival",
        "ar": "مهرجان الصيف"
      },
      "slug": "summer-festival",
      "status": "published",
      "eventDate": "2026-07-15T00:00:00.000Z",
      "startTime": "20:00",
      "location": {
        "de": "Düsseldorf",
        "en": "Düsseldorf",
        "ar": "دوسلدورف"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 6,
    "totalItems": 10,
    "totalPages": 2
  }
}
```

---

## 21.2 Get Public Grouped Events

### GET `/api/events/public-grouped`

Returns published events separated into:

- upcomingEvents
- pastEvents

Upcoming events are sorted by nearest event date.

Past events are sorted by latest past date.

### Access

Public

### Query Parameters

| Query  | Type   | Default | Description                        |
| ------ | ------ | ------- | ---------------------------------- |
| page   | number | 1       | Current page for upcoming events   |
| limit  | number | 3       | Items per page for upcoming events |
| search | string | empty   | Search keyword                     |

### Example

```http
GET /api/events/public-grouped?page=1&limit=3
```

### Response

```json
{
  "success": true,
  "data": {
    "upcomingEvents": [
      {
        "_id": "eventId",
        "title": {
          "de": "Sommer Festival",
          "en": "Summer Festival",
          "ar": "مهرجان الصيف"
        },
        "slug": "summer-festival",
        "eventDate": "2026-07-15T00:00:00.000Z",
        "status": "published"
      }
    ],
    "pastEvents": [
      {
        "_id": "pastEventId",
        "title": {
          "de": "Vergangenes Event",
          "en": "Past Event",
          "ar": "فعالية سابقة"
        },
        "slug": "past-event",
        "eventDate": "2025-12-01T00:00:00.000Z",
        "status": "published"
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 3,
    "totalItems": 5,
    "totalPages": 2
  }
}
```

---

## 21.3 Get Public Event by Slug

### GET `/api/events/public/:slug`

Returns a single event by slug.

### Access

Public

### URL Params

| Param | Type   | Description |
| ----- | ------ | ----------- |
| slug  | string | Event slug  |

### Example

```http
GET /api/events/public/summer-festival
```

### Response

```json
{
  "success": true,
  "data": {
    "_id": "eventId",
    "title": {
      "de": "Sommer Festival",
      "en": "Summer Festival",
      "ar": "مهرجان الصيف"
    },
    "slug": "summer-festival",
    "description": {
      "de": "Lange Beschreibung",
      "en": "Long description",
      "ar": "وصف طويل"
    },
    "videos": [],
    "status": "published"
  }
}
```

### Not Found Response

```json
{
  "success": false,
  "message": "Event not found"
}
```

---

# 22. Admin Events

Admin event endpoints require authentication and event permissions.

Base path:

```text
/api/events/admin
```

---

## 22.1 Get Admin Events

### GET `/api/events/admin`

Returns all non-deleted events for the admin panel.

Unlike public endpoints, this endpoint can return:

- draft events
- published events
- archived events

### Access

Authenticated Admin

### Required Permission

```text
events:read
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Query Parameters

| Query    | Type   | Default | Description                     |
| -------- | ------ | ------- | ------------------------------- |
| page     | number | 1       | Current page                    |
| limit    | number | 10      | Items per page                  |
| status   | string | all     | draft, published, archived, all |
| featured | string | all     | true, false, all                |
| search   | string | empty   | Search keyword                  |

### Example

```http
GET /api/events/admin?page=1&limit=10&status=published&featured=all&search=festival
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "eventId",
      "title": {
        "de": "Sommer Festival",
        "en": "Summer Festival",
        "ar": "مهرجان الصيف"
      },
      "slug": "summer-festival",
      "status": "published",
      "isFeatured": true,
      "eventDate": "2026-07-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

---

## 22.2 Get Admin Event by ID

### GET `/api/events/admin/:id`

Returns a single event by MongoDB ID.

### Access

Authenticated Admin

### Required Permission

```text
events:read
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### URL Params

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | string | Event ID    |

### Example

```http
GET /api/events/admin/64f123456789abcdef123456
```

### Response

```json
{
  "success": true,
  "data": {
    "_id": "eventId",
    "title": {
      "de": "Sommer Festival",
      "en": "Summer Festival",
      "ar": "مهرجان الصيف"
    },
    "slug": "summer-festival",
    "status": "published"
  }
}
```

---

## 22.3 Create Event

### POST `/api/events/admin`

Creates a new event.

### Access

Authenticated Admin

### Required Permission

```text
events:create
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "title": {
    "de": "Sommer Festival",
    "en": "Summer Festival",
    "ar": "مهرجان الصيف"
  },
  "slug": "summer-festival",
  "shortDescription": {
    "de": "Kurze Beschreibung",
    "en": "Short description",
    "ar": "وصف قصير"
  },
  "description": {
    "de": "Lange Beschreibung",
    "en": "Long description",
    "ar": "وصف طويل"
  },
  "coverImage": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "collective/events/image-id",
    "alt": {
      "de": "Sommer Festival",
      "en": "Summer Festival",
      "ar": "مهرجان الصيف"
    }
  },
  "galleryImages": [],
  "videos": [
    {
      "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
      "title": {
        "de": "Video Titel",
        "en": "Video Title",
        "ar": "عنوان الفيديو"
      },
      "description": {
        "de": "",
        "en": "",
        "ar": ""
      }
    }
  ],
  "eventDate": "2026-07-15",
  "startTime": "20:00",
  "endTime": "23:00",
  "location": {
    "de": "Düsseldorf",
    "en": "Düsseldorf",
    "ar": "دوسلدورف"
  },
  "googleMapsUrl": "https://maps.google.com/...",
  "ticketUrl": "https://tickets.example.com",
  "lineup": ["Artist One", "Artist Two"],
  "category": "Festival",
  "status": "draft",
  "isFeatured": false
}
```

### Required Fields

Required by the model:

- title.de
- title.en
- title.ar
- slug
- shortDescription.de
- shortDescription.en
- shortDescription.ar
- description.de
- description.en
- description.ar
- eventDate
- startTime
- location.de
- location.en
- location.ar

### Success Response

```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "_id": "eventId",
    "title": {
      "de": "Sommer Festival",
      "en": "Summer Festival",
      "ar": "مهرجان الصيف"
    },
    "slug": "summer-festival",
    "status": "draft",
    "isDeleted": false
  }
}
```

---

## 22.4 Update Event

### PUT `/api/events/admin/:id`

Updates an existing event.

If a new cover image is sent and the `publicId` is different from the old cover image, the old Cloudinary image is deleted automatically.

### Access

Authenticated Admin

### Required Permission

```text
events:update
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### URL Params

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | string | Event ID    |

### Request Body

Partial or full event data can be sent.

Example:

```json
{
  "title": {
    "de": "Updated Festival",
    "en": "Updated Festival",
    "ar": "مهرجان محدث"
  },
  "status": "published",
  "isFeatured": true
}
```

### Success Response

```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "_id": "eventId",
    "title": {
      "de": "Updated Festival",
      "en": "Updated Festival",
      "ar": "مهرجان محدث"
    },
    "status": "published",
    "isFeatured": true
  }
}
```

### Not Found Response

```json
{
  "success": false,
  "message": "Event not found"
}
```

---

## 22.5 Delete Event

### DELETE `/api/events/admin/:id`

Soft deletes an event.

The event is not physically removed from MongoDB. Instead:

```json
{
  "isDeleted": true
}
```

Cloudinary cleanup is performed for:

- cover image
- gallery images stored inside the event document

### Access

Authenticated Admin

### Required Permission

```text
events:delete
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### URL Params

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | string | Event ID    |

### Success Response

```json
{
  "success": true,
  "message": "Event deleted successfully",
  "data": {
    "_id": "eventId",
    "isDeleted": true
  }
}
```

---

# 23. Event Search Behavior

The Events API search checks multiple fields.

Searchable fields include:

- title.de
- title.en
- title.ar
- shortDescription.de
- shortDescription.en
- shortDescription.ar
- description.de
- description.en
- description.ar
- location.de
- location.en
- location.ar
- category
- lineup

Search is case-insensitive.

---

# 24. Event Sorting Behavior

Admin events:

```text
eventDate descending
```

Public events:

```text
eventDate descending
```

Public grouped upcoming events:

```text
eventDate ascending
startTime ascending
```

Public grouped past events:

```text
eventDate descending
startTime descending
```

---

# 25. Event Cloudinary Cleanup

When an event is updated:

- if the cover image changes
- and the old `publicId` is different from the new `publicId`

the old Cloudinary asset is deleted.

When an event is deleted:

- the cover image is deleted from Cloudinary
- all event gallery images inside the event document are deleted from Cloudinary

---

# 26. End of Part 2

This part documented:

- public event endpoints
- grouped event endpoint
- event details endpoint
- admin event list
- create event
- update event
- delete event
- event search behavior
- event sorting behavior
- Cloudinary cleanup behavior

Next part should document:

- Gallery API
- Uploads API
- Videos API
- Team API

---

# 27. Gallery API

Base path:

```text
/api/gallery
```

The Gallery API manages gallery images displayed on the public website and inside the admin panel.

Gallery images can contain:

- image URL
- Cloudinary public ID
- localized title
- localized description
- status
- featured flag
- related event
- sort order
- deletion state

---

# 28. Gallery Image Object

Example gallery image object:

```json
{
  "_id": "galleryImageId",
  "title": {
    "de": "Galerie Bild",
    "en": "Gallery Image",
    "ar": "صورة من المعرض"
  },
  "description": {
    "de": "Beschreibung",
    "en": "Description",
    "ar": "وصف"
  },
  "image": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "collective/gallery/image-id"
  },
  "status": "published",
  "isFeatured": false,
  "relatedEvent": "eventId",
  "sortOrder": 1,
  "isDeleted": false,
  "createdAt": "2026-06-28T12:00:00.000Z",
  "updatedAt": "2026-06-28T12:00:00.000Z"
}
```

---

# 29. Gallery Status

Supported statuses:

```text
draft
published
archived
```

Only images with:

```text
status = published
```

are returned by public endpoints.

---

# 30. Public Gallery Endpoints

Public gallery endpoints do not require authentication.

---

## 30.1 Get Public Gallery Images

### GET `/api/gallery/public`

Returns published gallery images.

### Access

Public

### Query Parameters

| Query  | Type   | Default | Description    |
| ------ | ------ | ------- | -------------- |
| page   | number | 1       | Current page   |
| limit  | number | 6       | Items per page |
| search | string | empty   | Search keyword |

### Example

```http
GET /api/gallery/public?page=1&limit=6&search=festival
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "galleryImageId",
      "title": {
        "de": "Galerie Bild",
        "en": "Gallery Image",
        "ar": "صورة من المعرض"
      },
      "description": {
        "de": "Beschreibung",
        "en": "Description",
        "ar": "وصف"
      },
      "image": {
        "url": "https://res.cloudinary.com/...",
        "publicId": "collective/gallery/image-id"
      },
      "status": "published",
      "isFeatured": false,
      "sortOrder": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 6,
    "totalItems": 9,
    "totalPages": 2
  }
}
```

---

## 30.2 Get Public Gallery Image by ID

### GET `/api/gallery/public/:id`

Returns a single gallery image by ID.

### Access

Public

### URL Params

| Param | Type   | Description      |
| ----- | ------ | ---------------- |
| id    | string | Gallery image ID |

### Example

```http
GET /api/gallery/public/64f123456789abcdef123456
```

### Response

```json
{
  "success": true,
  "data": {
    "_id": "galleryImageId",
    "title": {
      "de": "Galerie Bild",
      "en": "Gallery Image",
      "ar": "صورة من المعرض"
    },
    "image": {
      "url": "https://res.cloudinary.com/...",
      "publicId": "collective/gallery/image-id"
    },
    "status": "published"
  }
}
```

---

# 31. Admin Gallery Endpoints

Admin gallery endpoints require authentication and gallery permissions.

Base path:

```text
/api/gallery/admin
```

---

## 31.1 Get Admin Gallery Images

### GET `/api/gallery/admin`

Returns all non-deleted gallery images for the admin panel.

### Access

Authenticated Admin

### Required Permission

```text
gallery:read
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Query Parameters

| Query  | Type   | Default | Description                     |
| ------ | ------ | ------- | ------------------------------- |
| page   | number | 1       | Current page                    |
| limit  | number | 10      | Items per page                  |
| status | string | all     | draft, published, archived, all |
| search | string | empty   | Search keyword                  |

### Example

```http
GET /api/gallery/admin?page=1&limit=10&status=all&search=festival
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "galleryImageId",
      "title": {
        "de": "Galerie Bild",
        "en": "Gallery Image",
        "ar": "صورة من المعرض"
      },
      "image": {
        "url": "https://res.cloudinary.com/...",
        "publicId": "collective/gallery/image-id"
      },
      "status": "published",
      "isFeatured": false,
      "sortOrder": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 9,
    "totalPages": 1
  }
}
```

---

## 31.2 Create Gallery Image

### POST `/api/gallery/admin`

Creates a new gallery image record.

The image file itself should be uploaded first through the Uploads API.

### Access

Authenticated Admin

### Required Permission

```text
gallery:create
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "title": {
    "de": "Galerie Bild",
    "en": "Gallery Image",
    "ar": "صورة من المعرض"
  },
  "description": {
    "de": "Beschreibung",
    "en": "Description",
    "ar": "وصف"
  },
  "image": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "collective/gallery/image-id"
  },
  "status": "published",
  "isFeatured": false,
  "relatedEvent": "eventId",
  "sortOrder": 1
}
```

### Success Response

```json
{
  "success": true,
  "message": "Gallery image created successfully",
  "data": {
    "_id": "galleryImageId",
    "title": {
      "de": "Galerie Bild",
      "en": "Gallery Image",
      "ar": "صورة من المعرض"
    },
    "status": "published",
    "isDeleted": false
  }
}
```

---

## 31.3 Reorder Gallery Images

### PUT `/api/gallery/admin/reorder`

Updates gallery image order.

### Access

Authenticated Admin

### Required Permission

```text
gallery:update
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "items": [
    {
      "id": "galleryImageId1",
      "sortOrder": 1
    },
    {
      "id": "galleryImageId2",
      "sortOrder": 2
    }
  ]
}
```

### Success Response

```json
{
  "success": true,
  "message": "Gallery images reordered successfully",
  "data": [
    {
      "_id": "galleryImageId1",
      "sortOrder": 1
    },
    {
      "_id": "galleryImageId2",
      "sortOrder": 2
    }
  ]
}
```

---

## 31.4 Update Gallery Image

### PUT `/api/gallery/admin/:id`

Updates an existing gallery image.

If the image public ID changes, the previous Cloudinary image is deleted automatically.

### Access

Authenticated Admin

### Required Permission

```text
gallery:update
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### URL Params

| Param | Type   | Description      |
| ----- | ------ | ---------------- |
| id    | string | Gallery image ID |

### Request Body

```json
{
  "title": {
    "de": "Updated Bild",
    "en": "Updated Image",
    "ar": "صورة محدثة"
  },
  "description": {
    "de": "Neue Beschreibung",
    "en": "New description",
    "ar": "وصف جديد"
  },
  "status": "published",
  "isFeatured": true
}
```

### Success Response

```json
{
  "success": true,
  "message": "Gallery image updated successfully",
  "data": {
    "_id": "galleryImageId",
    "title": {
      "de": "Updated Bild",
      "en": "Updated Image",
      "ar": "صورة محدثة"
    },
    "status": "published",
    "isFeatured": true
  }
}
```

---

## 31.5 Delete Gallery Image

### DELETE `/api/gallery/admin/:id`

Soft deletes a gallery image.

Cloudinary cleanup is performed for the stored image asset.

### Access

Authenticated Admin

### Required Permission

```text
gallery:delete
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### URL Params

| Param | Type   | Description      |
| ----- | ------ | ---------------- |
| id    | string | Gallery image ID |

### Success Response

```json
{
  "success": true,
  "message": "Gallery image deleted successfully",
  "data": {
    "_id": "galleryImageId",
    "isDeleted": true
  }
}
```

---

# 32. Uploads API

Base path:

```text
/api/uploads
```

Uploads are protected and require authentication.

Uploads are sent as `multipart/form-data`.

---

# 33. Upload Limits

Image upload limit:

```text
15 MB
```

Video upload limit:

```text
200 MB
```

Multiple image upload limit:

```text
10 images per request
```

---

## 33.1 Upload Single Image

### POST `/api/uploads/single`

Uploads a single image to Cloudinary.

### Access

Authenticated Admin

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data
```

### Form Data

| Field | Type | Required |
| ----- | ---- | -------- |
| image | file | yes      |

### Success Response

```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "collective/image-id"
  }
}
```

---

## 33.2 Upload Multiple Images

### POST `/api/uploads/multiple`

Uploads multiple images to Cloudinary.

### Access

Authenticated Admin

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data
```

### Form Data

| Field  | Type   | Required |
| ------ | ------ | -------- |
| images | file[] | yes      |

### Success Response

```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": [
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "collective/image-id-1"
    },
    {
      "url": "https://res.cloudinary.com/...",
      "publicId": "collective/image-id-2"
    }
  ]
}
```

---

## 33.3 Upload Single Video

### POST `/api/uploads/video`

Uploads a single video to Cloudinary.

### Access

Authenticated Admin

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: multipart/form-data
```

### Form Data

| Field | Type | Required |
| ----- | ---- | -------- |
| video | file | yes      |

### Success Response

```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "collective/video-id"
  }
}
```

---

# 34. Videos API

Base path:

```text
/api/videos
```

The Videos API manages standalone public videos.

This is separate from event-specific YouTube videos stored inside event documents.

---

# 35. Video Object

Example video object:

```json
{
  "_id": "videoId",
  "title": {
    "de": "Video Titel",
    "en": "Video Title",
    "ar": "عنوان الفيديو"
  },
  "description": {
    "de": "Beschreibung",
    "en": "Description",
    "ar": "وصف"
  },
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "thumbnail": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "collective/videos/thumbnail-id"
  },
  "status": "published",
  "isFeatured": false,
  "sortOrder": 1,
  "isDeleted": false,
  "createdAt": "2026-06-28T12:00:00.000Z",
  "updatedAt": "2026-06-28T12:00:00.000Z"
}
```

---

# 36. Public Video Endpoints

---

## 36.1 Get Public Videos

### GET `/api/videos/public`

Returns published videos.

### Access

Public

### Query Parameters

| Query  | Type   | Default | Description    |
| ------ | ------ | ------- | -------------- |
| page   | number | 1       | Current page   |
| limit  | number | 6       | Items per page |
| search | string | empty   | Search keyword |

### Example

```http
GET /api/videos/public?page=1&limit=6
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "videoId",
      "title": {
        "de": "Video Titel",
        "en": "Video Title",
        "ar": "عنوان الفيديو"
      },
      "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
      "status": "published"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 6,
    "totalItems": 4,
    "totalPages": 1
  }
}
```

---

## 36.2 Get Public Video by ID

### GET `/api/videos/public/:id`

Returns a single video by ID.

### Access

Public

### URL Params

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | string | Video ID    |

### Response

```json
{
  "success": true,
  "data": {
    "_id": "videoId",
    "title": {
      "de": "Video Titel",
      "en": "Video Title",
      "ar": "عنوان الفيديو"
    },
    "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
    "status": "published"
  }
}
```

---

# 37. Admin Video Endpoints

Base path:

```text
/api/videos/admin
```

---

## 37.1 Get Admin Videos

### GET `/api/videos/admin`

Returns all non-deleted videos.

### Access

Authenticated Admin

### Required Permission

```text
videos:read
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Query Parameters

| Query  | Type   | Default | Description                     |
| ------ | ------ | ------- | ------------------------------- |
| page   | number | 1       | Current page                    |
| limit  | number | 10      | Items per page                  |
| status | string | all     | draft, published, archived, all |
| search | string | empty   | Search keyword                  |

### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "videoId",
      "title": {
        "de": "Video Titel",
        "en": "Video Title",
        "ar": "عنوان الفيديو"
      },
      "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
      "status": "published"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 4,
    "totalPages": 1
  }
}
```

---

## 37.2 Create Video

### POST `/api/videos/admin`

Creates a new standalone video.

### Access

Authenticated Admin

### Required Permission

```text
videos:create
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "title": {
    "de": "Video Titel",
    "en": "Video Title",
    "ar": "عنوان الفيديو"
  },
  "description": {
    "de": "Beschreibung",
    "en": "Description",
    "ar": "وصف"
  },
  "youtubeUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "thumbnail": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "collective/videos/thumbnail-id"
  },
  "status": "published",
  "isFeatured": false,
  "sortOrder": 1
}
```

### Success Response

```json
{
  "success": true,
  "message": "Video created successfully",
  "data": {
    "_id": "videoId",
    "title": {
      "de": "Video Titel",
      "en": "Video Title",
      "ar": "عنوان الفيديو"
    },
    "status": "published"
  }
}
```

---

## 37.3 Update Video

### PUT `/api/videos/admin/:id`

Updates a standalone video.

If the thumbnail changes, the old Cloudinary thumbnail is deleted automatically.

### Access

Authenticated Admin

### Required Permission

```text
videos:update
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### URL Params

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | string | Video ID    |

### Request Body

```json
{
  "title": {
    "de": "Updated Video",
    "en": "Updated Video",
    "ar": "فيديو محدث"
  },
  "status": "published",
  "isFeatured": true
}
```

### Success Response

```json
{
  "success": true,
  "message": "Video updated successfully",
  "data": {
    "_id": "videoId",
    "title": {
      "de": "Updated Video",
      "en": "Updated Video",
      "ar": "فيديو محدث"
    },
    "status": "published"
  }
}
```

---

## 37.4 Delete Video

### DELETE `/api/videos/admin/:id`

Soft deletes a standalone video.

If a thumbnail exists, the Cloudinary thumbnail is deleted.

### Access

Authenticated Admin

### Required Permission

```text
videos:delete
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### URL Params

| Param | Type   | Description |
| ----- | ------ | ----------- |
| id    | string | Video ID    |

### Success Response

```json
{
  "success": true,
  "message": "Video deleted successfully",
  "data": {
    "_id": "videoId",
    "isDeleted": true
  }
}
```

---

# 38. Team API

Base path:

```text
/api/team
```

The Team API manages public team members.

---

# 39. Team Member Object

Example team member object:

```json
{
  "_id": "teamMemberId",
  "fullName": "Team Member",
  "role": {
    "de": "Rolle",
    "en": "Role",
    "ar": "الدور"
  },
  "bio": {
    "de": "Biografie",
    "en": "Biography",
    "ar": "نبذة"
  },
  "image": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "collective/team/member-id"
  },
  "instagramUrl": "https://instagram.com/example",
  "facebookUrl": "",
  "sortOrder": 1,
  "isDeleted": false,
  "createdAt": "2026-06-28T12:00:00.000Z",
  "updatedAt": "2026-06-28T12:00:00.000Z"
}
```

---

# 40. Public Team Endpoints

---

## 40.1 Get Public Team Members

### GET `/api/team/public`

Returns all non-deleted team members.

### Access

Public

### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "teamMemberId",
      "fullName": "Team Member",
      "role": {
        "de": "Rolle",
        "en": "Role",
        "ar": "الدور"
      },
      "image": {
        "url": "https://res.cloudinary.com/...",
        "publicId": "collective/team/member-id"
      }
    }
  ]
}
```

---

# 41. Admin Team Endpoints

Base path:

```text
/api/team/admin
```

---

## 41.1 Get Admin Team Members

### GET `/api/team/admin`

Returns all non-deleted team members.

### Access

Authenticated Admin

### Required Permission

```text
team:read
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "teamMemberId",
      "fullName": "Team Member",
      "role": {
        "de": "Rolle",
        "en": "Role",
        "ar": "الدور"
      }
    }
  ]
}
```

---

## 41.2 Create Team Member

### POST `/api/team/admin`

Creates a team member.

### Access

Authenticated Admin

### Required Permission

```text
team:create
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "fullName": "Team Member",
  "role": {
    "de": "Rolle",
    "en": "Role",
    "ar": "الدور"
  },
  "bio": {
    "de": "Biografie",
    "en": "Biography",
    "ar": "نبذة"
  },
  "image": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "collective/team/member-id"
  },
  "instagramUrl": "https://instagram.com/example",
  "facebookUrl": "",
  "sortOrder": 1
}
```

### Success Response

```json
{
  "success": true,
  "message": "Team member created successfully",
  "data": {
    "_id": "teamMemberId",
    "fullName": "Team Member"
  }
}
```

---

## 41.3 Update Team Member

### PUT `/api/team/admin/:id`

Updates a team member.

If the image changes, the old Cloudinary image is deleted automatically.

### Access

Authenticated Admin

### Required Permission

```text
team:update
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### URL Params

| Param | Type   | Description    |
| ----- | ------ | -------------- |
| id    | string | Team member ID |

### Success Response

```json
{
  "success": true,
  "message": "Team member updated successfully",
  "data": {
    "_id": "teamMemberId",
    "fullName": "Updated Team Member"
  }
}
```

---

## 41.4 Delete Team Member

### DELETE `/api/team/admin/:id`

Soft deletes a team member.

If the member has an image, the Cloudinary image is deleted.

### Access

Authenticated Admin

### Required Permission

```text
team:delete
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### URL Params

| Param | Type   | Description    |
| ----- | ------ | -------------- |
| id    | string | Team member ID |

### Success Response

```json
{
  "success": true,
  "message": "Team member deleted successfully",
  "data": {
    "_id": "teamMemberId",
    "isDeleted": true
  }
}
```

---

# 42. End of Part 3

This part documented:

- Gallery API
- Uploads API
- Videos API
- Team API
- Cloudinary upload behavior
- Media cleanup behavior

Next part should document:

- Home Content API
- Settings API
- Contact API
- Dashboard API
- Common errors
- Final endpoint reference

---

# 43. Home Content API

Base path:

```text
/api/home-content
```

The Home Content API manages editable content for the public homepage.

This allows admins to update homepage text, buttons, hero content and about preview content without changing code.

---

# 44. Home Content Object

Example home content object:

```json
{
  "_id": "homeContentId",
  "heroBadge": {
    "de": "Schu Fi Ma Fi Kollektiv",
    "en": "Schu Fi Ma Fi Collective",
    "ar": "شو في ما في"
  },
  "heroTitle": {
    "de": "Kultur, Musik und Events in NRW.",
    "en": "Culture, music and events in NRW.",
    "ar": "ثقافة، موسيقى وفعاليات في NRW."
  },
  "heroSubtitle": {
    "de": "Ein syrisches kulturelles Kollektiv...",
    "en": "A Syrian cultural collective...",
    "ar": "تجمع ثقافي سوري..."
  },
  "heroImage": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "collective/home/hero-image"
  },
  "primaryButton": {
    "label": {
      "de": "Events ansehen",
      "en": "View events",
      "ar": "عرض الفعاليات"
    },
    "url": "/events"
  },
  "secondaryButton": {
    "label": {
      "de": "Über uns",
      "en": "About us",
      "ar": "من نحن"
    },
    "url": "/about"
  },
  "aboutEyebrow": {
    "de": "Zusammenarbeit beginnen",
    "en": "Start collaboration",
    "ar": "ابدأ التعاون"
  },
  "aboutTitle": {
    "de": "Sind Sie bereit, Ihr bestes Event mit uns zu veranstalten?",
    "en": "Are you ready to organize your best event with us?",
    "ar": "هل أنت مستعد لتنظيم أفضل فعالية معنا؟"
  },
  "aboutText": {
    "de": "Sie suchen ein Team...",
    "en": "Are you looking for a team...",
    "ar": "هل تبحث عن فريق..."
  },
  "aboutButton": {
    "label": {
      "de": "Unsere Events",
      "en": "Our events",
      "ar": "فعالياتنا"
    },
    "url": "/events"
  },
  "createdAt": "2026-06-28T12:00:00.000Z",
  "updatedAt": "2026-06-28T12:00:00.000Z"
}
```

---

# 45. Public Home Content Endpoints

---

## 45.1 Get Public Home Content

### GET `/api/home-content/public`

Returns homepage content for the public website.

If no home content exists, the backend creates default home content automatically.

### Access

Public

### Response

```json
{
  "success": true,
  "data": {
    "_id": "homeContentId",
    "heroBadge": {
      "de": "Schu Fi Ma Fi Kollektiv",
      "en": "Schu Fi Ma Fi Collective",
      "ar": "شو في ما في"
    },
    "heroTitle": {
      "de": "Kultur, Musik und Events in NRW.",
      "en": "Culture, music and events in NRW.",
      "ar": "ثقافة، موسيقى وفعاليات في NRW."
    },
    "primaryButton": {
      "label": {
        "de": "Events ansehen",
        "en": "View events",
        "ar": "عرض الفعاليات"
      },
      "url": "/events"
    }
  }
}
```

---

# 46. Admin Home Content Endpoints

Base path:

```text
/api/home-content/admin
```

---

## 46.1 Get Admin Home Content

### GET `/api/home-content/admin`

Returns homepage content for the admin panel.

If no home content exists, the backend creates default content automatically.

### Access

Authenticated Admin

### Required Permission

```text
home-content:read
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Response

```json
{
  "success": true,
  "data": {
    "_id": "homeContentId",
    "heroTitle": {
      "de": "Kultur, Musik und Events in NRW.",
      "en": "Culture, music and events in NRW.",
      "ar": "ثقافة، موسيقى وفعاليات في NRW."
    }
  }
}
```

---

## 46.2 Update Home Content

### PUT `/api/home-content/admin`

Updates homepage content.

### Access

Authenticated Admin

### Required Permission

```text
home-content:update
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "heroBadge": {
    "de": "Schu Fi Ma Fi Kollektiv",
    "en": "Schu Fi Ma Fi Collective",
    "ar": "شو في ما في"
  },
  "heroTitle": {
    "de": "Neue Homepage Überschrift",
    "en": "New Homepage Title",
    "ar": "عنوان جديد للصفحة الرئيسية"
  },
  "heroSubtitle": {
    "de": "Neue Beschreibung",
    "en": "New description",
    "ar": "وصف جديد"
  },
  "heroImage": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "collective/home/hero-image"
  },
  "primaryButton": {
    "label": {
      "de": "Events ansehen",
      "en": "View events",
      "ar": "عرض الفعاليات"
    },
    "url": "/events"
  },
  "secondaryButton": {
    "label": {
      "de": "Kontakt",
      "en": "Contact",
      "ar": "تواصل معنا"
    },
    "url": "/contact"
  }
}
```

### Success Response

```json
{
  "success": true,
  "message": "Home content updated successfully",
  "data": {
    "_id": "homeContentId",
    "heroTitle": {
      "de": "Neue Homepage Überschrift",
      "en": "New Homepage Title",
      "ar": "عنوان جديد للصفحة الرئيسية"
    }
  }
}
```

---

# 47. Settings API

Base path:

```text
/api/settings
```

The Settings API manages global website settings.

These settings are used across the public website and admin panel.

---

# 48. Site Settings Object

Example settings object:

```json
{
  "_id": "settingsId",
  "siteName": {
    "de": "Schu Fi Ma Fi Collective",
    "en": "Schu Fi Ma Fi Collective",
    "ar": "شو في ما في"
  },
  "siteDescription": {
    "de": "Syrisches Kulturkollektiv für Events, Musik und Community in NRW.",
    "en": "Syrian cultural collective for events, music and community in NRW.",
    "ar": "تجمع ثقافي سوري للفعاليات والموسيقى والمجتمع في NRW."
  },
  "contactEmail": "contact@example.com",
  "contactPhone": "+49 000 000000",
  "instagramUrl": "https://instagram.com/example",
  "facebookUrl": "https://facebook.com/example",
  "youtubeUrl": "https://youtube.com/@example",
  "tiktokUrl": "https://tiktok.com/@example",
  "createdAt": "2026-06-28T12:00:00.000Z",
  "updatedAt": "2026-06-28T12:00:00.000Z"
}
```

---

# 49. Public Settings Endpoints

---

## 49.1 Get Public Settings

### GET `/api/settings/public`

Returns global website settings.

If no settings exist, default settings are created automatically.

### Access

Public

### Response

```json
{
  "success": true,
  "data": {
    "_id": "settingsId",
    "siteName": {
      "de": "Schu Fi Ma Fi Collective",
      "en": "Schu Fi Ma Fi Collective",
      "ar": "شو في ما في"
    },
    "contactEmail": "contact@example.com",
    "instagramUrl": "https://instagram.com/example"
  }
}
```

---

# 50. Admin Settings Endpoints

Base path:

```text
/api/settings/admin
```

---

## 50.1 Get Admin Settings

### GET `/api/settings/admin`

Returns website settings for the admin panel.

### Access

Authenticated Admin

### Required Permission

```text
settings:read
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Response

```json
{
  "success": true,
  "data": {
    "_id": "settingsId",
    "siteName": {
      "de": "Schu Fi Ma Fi Collective",
      "en": "Schu Fi Ma Fi Collective",
      "ar": "شو في ما في"
    },
    "contactEmail": "contact@example.com"
  }
}
```

---

## 50.2 Update Settings

### PUT `/api/settings/admin`

Updates global website settings.

### Access

Authenticated Admin

### Required Permission

```text
settings:update
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### Request Body

```json
{
  "siteName": {
    "de": "Schu Fi Ma Fi Collective",
    "en": "Schu Fi Ma Fi Collective",
    "ar": "شو في ما في"
  },
  "siteDescription": {
    "de": "Neue Beschreibung",
    "en": "New description",
    "ar": "وصف جديد"
  },
  "contactEmail": "contact@example.com",
  "contactPhone": "+49 000 000000",
  "instagramUrl": "https://instagram.com/example",
  "facebookUrl": "https://facebook.com/example",
  "youtubeUrl": "https://youtube.com/@example",
  "tiktokUrl": "https://tiktok.com/@example"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "_id": "settingsId",
    "contactEmail": "contact@example.com"
  }
}
```

---

# 51. Contact API

Base path:

```text
/api/contact
```

The Contact API handles public contact form messages and admin message management.

Visitors can send messages without logging in.

Admins can read, update and delete messages from the admin panel.

---

# 52. Contact Message Object

Example contact message object:

```json
{
  "_id": "messageId",
  "fullName": "Visitor Name",
  "email": "visitor@example.com",
  "subject": "Booking Request",
  "message": "Hello, I would like to ask about an event.",
  "status": "unread",
  "isDeleted": false,
  "createdAt": "2026-06-28T12:00:00.000Z",
  "updatedAt": "2026-06-28T12:00:00.000Z"
}
```

---

# 53. Contact Message Status

Supported statuses:

```text
unread
read
archived
```

New public messages are created with:

```text
unread
```

---

# 54. Public Contact Endpoints

---

## 54.1 Create Contact Message

### POST `/api/contact/public`

Creates a new contact message from the public contact form.

### Access

Public

### Headers

```http
Content-Type: application/json
```

### Request Body

```json
{
  "fullName": "Visitor Name",
  "email": "visitor@example.com",
  "subject": "Booking Request",
  "message": "Hello, I would like to ask about an event."
}
```

### Required Fields

- fullName
- email
- subject
- message

### Success Response

```json
{
  "success": true,
  "message": "Contact message sent successfully",
  "data": {
    "_id": "messageId",
    "fullName": "Visitor Name",
    "email": "visitor@example.com",
    "subject": "Booking Request",
    "message": "Hello, I would like to ask about an event.",
    "status": "unread"
  }
}
```

---

# 55. Admin Contact Endpoints

Base path:

```text
/api/contact/admin
```

---

## 55.1 Get Admin Contact Messages

### GET `/api/contact/admin`

Returns contact messages for the admin panel.

### Access

Authenticated Admin

### Required Permission

```text
contact:read
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Query Parameters

| Query  | Type   | Default | Description                 |
| ------ | ------ | ------- | --------------------------- |
| page   | number | 1       | Current page                |
| limit  | number | 10      | Items per page              |
| status | string | all     | unread, read, archived, all |
| search | string | empty   | Search keyword              |

### Example

```http
GET /api/contact/admin?page=1&limit=10&status=unread&search=booking
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "messageId",
      "fullName": "Visitor Name",
      "email": "visitor@example.com",
      "subject": "Booking Request",
      "message": "Hello, I would like to ask about an event.",
      "status": "unread",
      "createdAt": "2026-06-28T12:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 10,
    "totalPages": 1
  }
}
```

---

## 55.2 Update Contact Message

### PUT `/api/contact/admin/:id`

Updates contact message status.

### Access

Authenticated Admin

### Required Permission

```text
contact:update
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

### URL Params

| Param | Type   | Description        |
| ----- | ------ | ------------------ |
| id    | string | Contact message ID |

### Request Body

```json
{
  "status": "read"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Contact message updated successfully",
  "data": {
    "_id": "messageId",
    "status": "read"
  }
}
```

---

## 55.3 Delete Contact Message

### DELETE `/api/contact/admin/:id`

Soft deletes a contact message.

### Access

Authenticated Admin

### Required Permission

```text
contact:delete
```

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### URL Params

| Param | Type   | Description        |
| ----- | ------ | ------------------ |
| id    | string | Contact message ID |

### Success Response

```json
{
  "success": true,
  "message": "Contact message deleted successfully",
  "data": {
    "_id": "messageId",
    "isDeleted": true
  }
}
```

---

# 56. Dashboard API

Base path:

```text
/api/dashboard
```

The Dashboard API returns admin dashboard statistics.

---

## 56.1 Get Admin Dashboard Stats

### GET `/api/dashboard/admin/stats`

Returns CMS statistics for the admin dashboard.

### Access

Authenticated Admin

### Headers

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Response

```json
{
  "success": true,
  "data": {
    "totalEvents": 10,
    "publishedEvents": 8,
    "galleryImages": 9,
    "videos": 4,
    "teamMembers": 5,
    "unreadMessages": 2
  }
}
```

---

# 57. Common API Errors

---

## Unauthorized

Returned when no token is provided or the token is invalid.

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

or:

```json
{
  "success": false,
  "message": "Invalid token"
}
```

---

## Forbidden

Returned when the admin is authenticated but does not have the required permission.

```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

---

## Not Found

Returned when a requested resource does not exist.

```json
{
  "success": false,
  "message": "Event not found"
}
```

---

## Validation Error

Returned when required fields are missing or invalid.

```json
{
  "success": false,
  "message": "Required fields are missing"
}
```

---

# 58. Final Endpoint Reference

| Method | Endpoint                     | Access      | Permission          |
| ------ | ---------------------------- | ----------- | ------------------- |
| GET    | `/api/health`                | Public      | none                |
| GET    | `/api/auth/status`           | Public      | none                |
| POST   | `/api/auth/login`            | Public      | none                |
| GET    | `/api/auth/me`               | Admin       | authenticated       |
| GET    | `/api/dashboard/admin/stats` | Admin       | authenticated       |
| GET    | `/api/admins/status`         | Public      | none                |
| GET    | `/api/admins/profile`        | Admin       | authenticated       |
| GET    | `/api/admins/roles`          | Admin       | admins:read         |
| POST   | `/api/admins/roles`          | Admin       | admins:create       |
| PUT    | `/api/admins/roles/:id`      | Admin       | admins:update       |
| DELETE | `/api/admins/roles/:id`      | Admin       | admins:delete       |
| GET    | `/api/admins`                | Admin       | admins:read         |
| POST   | `/api/admins`                | Admin       | admins:create       |
| PUT    | `/api/admins/:id`            | Admin       | admins:update       |
| DELETE | `/api/admins/:id`            | Admin       | admins:delete       |
| GET    | `/api/events/public`         | Public      | none                |
| GET    | `/api/events/public-grouped` | Public      | none                |
| GET    | `/api/events/public/:slug`   | Public      | none                |
| GET    | `/api/events/admin`          | Admin       | events:read         |
| GET    | `/api/events/admin/:id`      | Admin       | events:read         |
| POST   | `/api/events/admin`          | Admin       | events:create       |
| PUT    | `/api/events/admin/:id`      | Admin       | events:update       |
| DELETE | `/api/events/admin/:id`      | Admin       | events:delete       |
| GET    | `/api/gallery/public`        | Public      | none                |
| GET    | `/api/gallery/public/:id`    | Public      | none                |
| GET    | `/api/gallery/admin`         | Admin       | gallery:read        |
| POST   | `/api/gallery/admin`         | Admin       | gallery:create      |
| PUT    | `/api/gallery/admin/reorder` | Admin       | gallery:update      |
| PUT    | `/api/gallery/admin/:id`     | Admin       | gallery:update      |
| DELETE | `/api/gallery/admin/:id`     | Admin       | gallery:delete      |
| POST   | `/api/uploads/single`        | Admin       | authenticated       |
| POST   | `/api/uploads/multiple`      | Admin       | authenticated       |
| POST   | `/api/uploads/video`         | Admin       | authenticated       |
| GET    | `/api/videos/public`         | Public      | none                |
| GET    | `/api/videos/public/:id`     | Public      | none                |
| GET    | `/api/videos/admin`          | Admin       | videos:read         |
| POST   | `/api/videos/admin`          | Admin       | videos:create       |
| PUT    | `/api/videos/admin/:id`      | Admin       | videos:update       |
| DELETE | `/api/videos/admin/:id`      | Admin       | videos:delete       |
| GET    | `/api/team/public`           | Public      | none                |
| GET    | `/api/team/admin`            | Admin       | team:read           |
| POST   | `/api/team/admin`            | Admin       | team:create         |
| PUT    | `/api/team/admin/:id`        | Admin       | team:update         |
| DELETE | `/api/team/admin/:id`        | Admin       | team:delete         |
| GET    | `/api/home-content/public`   | Public      | none                |
| GET    | `/api/home-content/admin`    | Admin       | home-content:read   |
| PUT    | `/api/home-content/admin`    | Admin       | home-content:update |
| GET    | `/api/settings/public`       | Public      | none                |
| GET    | `/api/settings/admin`        | Admin       | settings:read       |
| PUT    | `/api/settings/admin`        | Admin       | settings:update     |
| POST   | `/api/contact/public`        | Public      | none                |
| GET    | `/api/contact/admin`         | Admin       | contact:read        |
| PUT    | `/api/contact/admin/:id`     | Admin       | contact:update      |
| DELETE | `/api/contact/admin/:id`     | Admin       | contact:delete      |
| GET    | `/api/activity-logs/admin`   | Super Admin | super admin only    |

---

# 59. API Documentation Notes

This API uses:

- REST conventions
- JSON request bodies
- JSON responses
- JWT Bearer authentication
- Role-Based Access Control
- pagination
- localized text objects
- soft deletion for most CMS resources
- Cloudinary media metadata

The API is designed primarily for the Collective Platform CMS frontend but can also be used by other authorized clients if they implement the same authentication and permission model.

---

# 60. End of API Documentation

This document covers the current API surface of the Collective Platform CMS.

If new modules or endpoints are added, this file should be updated immediately so future developers can understand and maintain the system safely.
