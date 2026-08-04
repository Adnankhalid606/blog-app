# Blog Application

A full-stack blog application built with React, Node.js, Express, and MySQL. It includes authentication, role-based access, blog review, and image uploads.

This project was built as a learning project with a focus on clear folder structure, reusable frontend components, and a simple REST API.

## Features

### Public users

- View published blogs
- Search blogs by title
- Browse paginated results
- Read blog content with Markdown formatting
- Register, verify email, and sign in

### Authors

- Apply to become an author
- Create blog drafts with an optional cover image
- Write content using basic Markdown
- Preview Markdown before saving
- Edit, delete, and submit own blogs for review
- View all own blogs and their status

### Admins

- Review pending blog submissions
- Approve or reject blogs
- Review author applications
- Approve or reject author applications

## Tech Stack

### Frontend

- React
- React Router
- Tailwind CSS
- Axios
- Context API
- Vite

### Backend

- Node.js
- Express
- MySQL
- JWT
- bcrypt
- Multer
- Nodemailer

## Project Structure

```text
.
+-- Backend/
�   +-- controllers/     # Request handlers
�   +-- middleware/      # Authentication, roles, uploads, errors
�   +-- routes/          # API routes
�   +-- services/        # Database queries and business logic
�   +-- utils/           # Tokens, OTP, email helpers
+-- Frontend/
    +-- src/
        +-- components/  # Reusable UI components
        +-- context/     # Authentication context
        +-- hooks/       # Custom hooks
        +-- pages/       # Route pages
        +-- routes/      # Router and route protection
        +-- services/    # API calls only
        +-- utils/       # Small helper functions
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- MySQL server (I use XAMPP)
- An SMTP account for email verification (e.g., Gmail)

### 1. Clone the project

```bash
git clone <your-repository-url>
cd "blog-app"
```

### 2. Set up the backend

```bash
cd Backend
npm install
npm run dev
```

Rename `.env.example` to `.env` and update with your MySQL and SMTP credentials.

### 3. Set up the frontend

Open a second terminal:

```bash
cd Frontend
npm install
npm run dev
```

Rename `Frontend/.env.example` to `Frontend/.env` and update with your API URL:

```env
VITE_API_URL=http://localhost:3000/api
```

The frontend runs on `http://localhost:5173` by default. The backend is set up to allow this origin.

## API Overview

| Area | Main endpoints |
| --- | --- |
| Authentication | `/api/user/register`, `/api/user/login`, `/api/user/verify-email` |
| Blogs | `/api/blogs`, `/api/blogs/:id`, `/api/blogs/create` |
| Author applications | `/api/author/application` |
| Admin review | `/api/admin/blogs/pending` |

## Blog Status Flow

```text
Draft ? Pending review ? Published
                    +? Rejected
```

Authors create drafts and submit them for review. Admins approve or reject pending submissions.

## Markdown Support

Blog content supports basic Markdown:

```md
# Heading

Use **bold**, *italic*, `code`, and [links](https://example.com).
```

The create and edit form includes a preview button. Markdown is escaped before rendering to prevent HTML injection.

## Available Scripts

### Frontend

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run lint     # Run ESLint
```

### Backend

```bash
npm run dev      # Start the Express server with nodemon
```

## Current Limitations

The current backend does not yet provide endpoints for bookmarks, profile updates, filtering, or sorting. These features are not shown in the frontend until the API supports them. This project is work on only LocalHost Envirmonent as it is a learning project. For deploy it you need to change somethings. (Will drop a guide for that soon)
## Author

Adnan Khalid