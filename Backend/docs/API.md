# Blog Application API Documentation

A professional RESTful API specification for the Blog Application backend built with **Node.js**, **Express.js**, **MySQL**, **JWT Authentication**, and **Cloudinary**.

---

## 📌 Table of Contents

1. [Architecture & Technology Stack](#architecture--technology-stack)
2. [Database Schema](#database-schema)
3. [Authentication & Authorization](#authentication--authorization)
4. [File Upload Specification](#file-upload-specification)
5. [HTTP Status Codes](#http-status-codes)
6. [API Endpoints](#api-endpoints)
   - [Authentication Endpoints](#1-authentication-endpoints)
   - [Blog Endpoints](#2-blog-endpoints)
   - [Author Request Endpoints](#3-author-request-endpoints)
   - [Admin Endpoints](#4-admin-endpoints)

---

## 🏗 Architecture & Technology Stack

- **Runtime Environment**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MySQL (using `mysql2/promise`)
- **Authentication**: JWT (Access Token) + HTTP-Only Cookie (Refresh Token)
- **Media Storage**: Cloudinary (via `multer` memory storage buffer)
- **Rate Limiting**: `express-rate-limit` (20 attempts / 15 minutes per IP on auth routes)

---

## 🗄 Database Schema

The API interacts with a MySQL relational database consisting of the following key tables:

| Table | Primary Key | Description |
| :--- | :--- | :--- |
| `users` | `id` (INT) | Stores user credentials, email verification status (`verified`), and role (`user`, `author`, `admin`). |
| `blogs` | `id` (INT) | Stores blog title, content, Cloudinary image URL, `image_public_id`, author reference (`author_id`), and status (`draft`, `pending`, `rejected`, `published`). |
| `sessions` | `id` (INT UNSIGNED) | Tracks active refresh token hashes, IP addresses, user agents, and revocation status for multi-device auth. |
| `otp` | `id` (INT) | Stores temporary hashed one-time passwords for email verification. |
| `author_requests` | `id` (INT) | Stores applications from users seeking author privileges, including reason, review status (`pending`, `approved`, `rejected`, `cancelled`), and admin reviewer (`reviewed_by`). |

---

## 🔐 Authentication & Authorization

The application uses a **Dual Token System** for secure session management:

### 1. Access Token (JWT)
- **Lifetime**: 15 minutes
- **Delivery**: Returned in the JSON response payload upon login/refresh.
- **Usage**: Must be included in the `Authorization` header for protected endpoints:
  ```http
  Authorization: Bearer <access_token>
  ```

### 2. Refresh Token
- **Lifetime**: 1 day (24 hours)
- **Delivery**: Stored in a secure, HTTP-only cookie named `refreshtoken`.
- **Attributes**: `HttpOnly: true`, `Secure: true`, `SameSite: none`.

---

## 📤 File Upload Specification

Endpoints that support cover image uploads (`POST /api/blogs/create` and `PUT /api/blogs/:id`) use `multipart/form-data`.

- **Field Name**: `image`
- **Supported File Types**: `image/jpeg`, `image/png`, `image/webp`
- **Max File Size**: `5 MB`
- **Processing**: Uploaded files are buffered in RAM memory via `multer`, forwarded directly to **Cloudinary**, and stored as secure HTTPS URLs (`secure_url`) alongside Cloudinary identifiers (`image_public_id`).

---

## 🚦 HTTP Status Codes

| Code | Status | Description |
| :--- | :--- | :--- |
| **200** | OK | The request succeeded and returned the expected data. |
| **201** | Created | A new resource was created successfully. |
| **400** | Bad Request | Missing required fields, invalid format, or validation failure. |
| **401** | Unauthorized | Authentication missing, invalid, or expired token/credentials. |
| **403** | Forbidden | Insufficient permissions for the requested role or resource ownership. |
| **404** | Not Found | Target resource, user, or blog does not exist. |
| **409** | Conflict | Conflict with existing resource state (e.g. duplicate application). |
| **500** | Internal Server Error | Server-side runtime fault or unexpected failure. |

---

## 📡 API Endpoints

---

### 1. Authentication Endpoints

Base Path: `/api/user`

---

#### 1.1 Register User
- **Endpoint**: `/api/user/register`
- **HTTP Method**: `POST`
- **Auth Required**: No
- **Required Role**: None
- **Description**: Registers a new account and sends a 6-digit OTP code to the provided email address for verification.
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Request Parameters**: None
- **Query Parameters**: None
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "message": "User created successfully",
    "user": {
      "id": 1,
      "username": "John_doe",
      "email": "john@example.com",
      "verified": false
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing fields or email already registered.
- **Example Request**:
  ```bash
  curl -X POST http://localhost:3000/api/user/register \
    -H "Content-Type: application/json" \
    -d '{"username":"john_doe","email":"john@example.com","password":"Password123"}'
  ```

---

#### 1.2 Verify Email
- **Endpoint**: `/api/user/verify-email`
- **HTTP Method**: `POST`
- **Auth Required**: No
- **Required Role**: None
- **Description**: Verifies user's email address using the received 6-digit OTP code, sets a refresh token cookie, and returns an access token.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```
- **Request Parameters**: None
- **Query Parameters**: None
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "message": "Email verified successfully",
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": 1,
      "username": "John_doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Missing input or invalid/expired OTP code.

---

#### 1.3 Resend Verification Email
- **Endpoint**: `/api/user/resend-verification`
- **HTTP Method**: `POST`
- **Auth Required**: No
- **Required Role**: None
- **Description**: Generates a new 6-digit OTP and resends it to unverified user accounts.
- **Request Body**:
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "message": "Verification code resent successfully"
  }
  ```

---

#### 1.4 Login
- **Endpoint**: `/api/user/login`
- **HTTP Method**: `POST`
- **Auth Required**: No
- **Required Role**: None
- **Description**: Authenticates user credentials, registers an active session, attaches an HTTP-only Refresh Token cookie, and returns a JWT Access Token.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": 1,
      "username": "John_doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid email/password or email unverified.

---

#### 1.5 Refresh Token
- **Endpoint**: `/api/user/refresh-token`
- **HTTP Method**: `POST`
- **Auth Required**: Yes (via Refresh Token Cookie)
- **Required Role**: None
- **Description**: Issues a fresh Access Token using a valid `refreshtoken` cookie.
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "token": "eyJhbGciOiJIUzI1Ni..."
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Missing or revoked refresh token cookie.

---

#### 1.6 Current User
- **Endpoint**: `/api/user/me`
- **HTTP Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: Any Authenticated User
- **Description**: Returns profile details for the currently logged-in user.
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "message": "User found successfully",
    "user": {
      "id": 1,
      "username": "John_doe",
      "email": "john@example.com",
      "role": "user",
      "verified": 1
    }
  }
  ```

---

#### 1.7 Logout
- **Endpoint**: `/api/user/logout`
- **HTTP Method**: `POST`
- **Auth Required**: Yes (Refresh Token Cookie)
- **Required Role**: Any Authenticated User
- **Description**: Revokes the current session and clears the HTTP-only refresh token cookie.
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "message": "Logged out successfully"
  }
  ```

---

#### 1.8 Logout All Devices
- **Endpoint**: `/api/user/logout-all`
- **HTTP Method**: `POST`
- **Auth Required**: Yes (Refresh Token Cookie)
- **Required Role**: Any Authenticated User
- **Description**: Revokes all active session records for the user across all browsers/devices.
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "message": "Logged out from all devices successfully"
  }
  ```

---

#### 1.9 Request Password Reset
- **Endpoint**: `/api/user/forgot-password`
- **HTTP Method**: `POST`
- **Auth Required**: No
- **Required Role**: None
- **Description**: Sends a password reset OTP code to the requested email address.
- **Request Body**: `{"email": "john@example.com"}`
- **Success Response**: `200 OK`

---

#### 1.10 Reset Password
- **Endpoint**: `/api/user/reset-password`
- **HTTP Method**: `POST`
- **Auth Required**: No
- **Required Role**: None
- **Description**: Resets user password using valid OTP code.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "otp": "123456",
    "newPassword": "NewPassword123"
  }
  ```
- **Success Response**: `200 OK`

---

### 2. Blog Endpoints

Base Path: `/api/blogs`

---

#### 2.1 Get All Published Blogs
- **Endpoint**: `/api/blogs`
- **HTTP Method**: `GET`
- **Auth Required**: No
- **Required Role**: None
- **Description**: Retrieves a paginated list of all published blog posts with search query support.
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10, max: 50)
  - `search` (optional): Filter blogs by title keyword
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "page": 1,
    "limit": 10,
    "totalBlogs": 12,
    "totalPages": 2,
    "blogs": [
      {
        "id": 5,
        "author_id": 2,
        "author_name": "jane_author",
        "title": "Exploring Modern Web Development",
        "content": "# Heading\n\nContent details here...",
        "image": "https://res.cloudinary.com/.../cover.jpg",
        "image_public_id": "blogs/cover_123",
        "status": "published",
        "created_at": "2026-08-07T10:00:00.000Z"
      }
    ]
  }
  ```

---

#### 2.2 Get Blog By ID
- **Endpoint**: `/api/blogs/:id`
- **HTTP Method**: `GET`
- **Auth Required**: No
- **Required Role**: None
- **Request Parameters**: `id` (int) - Target blog ID
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "blog": {
      "id": 5,
      "author_id": 2,
      "author_name": "jane_author",
      "title": "Exploring Modern Web Development",
      "content": "Full Markdown content...",
      "image": "https://res.cloudinary.com/.../cover.jpg",
      "status": "published"
    }
  }
  ```

---

#### 2.3 Create Blog
- **Endpoint**: `/api/blogs/create`
- **HTTP Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: `author`, `admin`
- **Content-Type**: `multipart/form-data`
- **Description**: Creates a new blog post. Blogs created by `admin` are automatically marked `published`; blogs created by `author` start as `draft`.
- **Request Body (FormData)**:
  - `title` (text, required)
  - `content` (text, required)
  - `image` (file, optional)
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "message": "Blog Created Successfully",
    "blog": {
      "id": 6,
      "title": "My New Blog Post",
      "content": "Content here...",
      "status": "draft"
    }
  }
  ```

---

#### 2.4 Update Blog
- **Endpoint**: `/api/blogs/:id`
- **HTTP Method**: `PUT`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: `author` (owner only), `admin`
- **Content-Type**: `multipart/form-data`
- **Description**: Updates blog title, content, and optional replacement cover image.
- **Request Body (FormData)**:
  - `title` (text, optional)
  - `content` (text, optional)
  - `image` (file, optional)
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "message": "Blog Updated Successfully",
    "blog": {
      "id": 6,
      "title": "Updated Title",
      "content": "Updated content..."
    }
  }
  ```

---

#### 2.5 Delete Blog
- **Endpoint**: `/api/blogs/:id`
- **HTTP Method**: `DELETE`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: `author` (owner only), `admin`
- **Description**: Deletes blog record from MySQL and removes associated cover image from Cloudinary.
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "message": "Blog Deleted Successfully"
  }
  ```

---

#### 2.6 Get My Blogs
- **Endpoint**: `/api/blogs/me`
- **HTTP Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: `author`, `admin`
- **Description**: Returns all blogs (drafts, pending, published, rejected) owned by the authenticated user.
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "blogs": [...]
  }
  ```

---

#### 2.7 Submit Blog For Approval
- **Endpoint**: `/api/blogs/:id/publish`
- **HTTP Method**: `PATCH`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: `author` (owner only), `admin`
- **Description**: Submits a `draft` blog post for admin review (changes status to `pending`).
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "message": "Blog submitted for approval",
    "blog": { "id": 6, "status": "pending" }
  }
  ```

---

### 3. Author Request Endpoints

Base Path: `/api/author`

---

#### 3.1 Apply For Author Status
- **Endpoint**: `/api/author/application`
- **HTTP Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: `user`
- **Description**: Submits an application to promote the user account to the `author` role.
- **Request Body**:
  ```json
  {
    "reason": "I am a technical writer specializing in Node.js and SQL architectures."
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "message": "Application submitted successfully"
  }
  ```

---

#### 3.2 Cancel Author Application
- **Endpoint**: `/api/author/application/cancel`
- **HTTP Method**: `PATCH`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: `user`
- **Description**: Cancels a user's pending author application.
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "message": "Application cancelled successfully"
  }
  ```

---

### 4. Admin Endpoints

Base Path: `/api/admin` & `/api/author`

---

#### 4.1 Get All Author Applications
- **Endpoint**: `/api/author/application`
- **HTTP Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: `admin`
- **Success Response**: `200 OK`

---

#### 4.2 Get Pending Author Applications
- **Endpoint**: `/api/author/application/pending`
- **HTTP Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: `admin`
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "pendingApplications": [...]
  }
  ```

---

#### 4.3 Approve Author Application
- **Endpoint**: `/api/author/application/:id/accept`
- **HTTP Method**: `PATCH`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: `admin`
- **Description**: Accepts an author application, updating application status to `approved` and promoting the applicant's role in `users` table to `author`.
- **Success Response**: `200 OK`

---

#### 4.4 Reject Author Application
- **Endpoint**: `/api/author/application/:id/reject`
- **HTTP Method**: `PATCH`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: `admin`
- **Success Response**: `200 OK`

---

#### 4.5 Get Pending Blogs for Review
- **Endpoint**: `/api/admin/blogs/pending`
- **HTTP Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: `admin`
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "blogs": [...]
  }
  ```

---

#### 4.6 Approve Blog Submission
- **Endpoint**: `/api/admin/blogs/:id/approve`
- **HTTP Method**: `PUT`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: `admin`
- **Description**: Approves a pending blog submission, changing status to `published`.
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "message": "Blog approved successfully"
  }
  ```

---

#### 4.7 Reject Blog Submission
- **Endpoint**: `/api/admin/blogs/:id/reject`
- **HTTP Method**: `PUT`
- **Auth Required**: Yes (Bearer Token)
- **Required Role**: `admin`
- **Description**: Rejects a pending blog submission, changing status to `rejected`.
- **Success Response**: `200 OK`
  ```json
  {
    "status": true,
    "message": "Blog rejected successfully"
  }
  ```
