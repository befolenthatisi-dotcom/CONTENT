# ThinkSpace

### A Space for Ideas, Knowledge and Creativity

ThinkSpace is a content-sharing web application that allows creators to publish and manage content while giving visitors a platform to explore, read, and engage with published articles and other resources.

## Project Overview

ThinkSpace provides two main areas:

- **Public Viewer Portal:** Allows visitors to browse published content, search for articles, filter content by category, read articles and interact through likes and comments.
- **Creator Dashboard:** Provides an authenticated workspace where creators can manage content, monitor engagement and control publication status.

## Features

### Public Viewer Portal
- Browse published content.
- Search content by title and keywords.
- Filter content by category.
- View individual content details.
- Read articles and access available media.
- Like content.
- Post and view approved comments.
- Share content using a copied link.
- View content engagement statistics.
- Responsive interface for different screen sizes.

### Creator Dashboard
- Secure creator login.
- Protected dashboard access.
- View dashboard statistics.
- Create new content.
- Edit existing content.
- Delete content.
- Organise content by category.
- Manage Draft, Published and Scheduled content.
- Schedule content for future publication.
- Review and moderate viewer comments.

### Viewer Engagement
- Multiple visitors can like the same content.
- Prevent duplicate likes from the same browser-based viewer ID.
- Submit comments for creator moderation.
- Display approved comments.
- Track content views.
- Share content through its URL.

## Technologies Used

 Area                      Technology 

Frontend                      React.js 
Backend                       Node.js 
Backend Framework             Express.js 
Database                      MongoDB 
Database Hosting              MongoDB Atlas 
 Authentication              JSON Web Tokens (JWT) 
 Password Security           Password Hashing 
 API Communication           REST API 
Styling                      CSS 
Version Control               Git and GitHub 


## Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd ThinkSpace
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and configure the required environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Use the exact environment variable names required by the backend configuration.

Start the backend:

```bash
npm start
```

### 3. Set Up the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

env
REACT_APP_API_URL=http://127.0.0.1:5000/api


Start the React application:

bash
npm start


The frontend should be available at:

text
http://localhost:3000


## Database

ThinkSpace uses MongoDB to store application data, including:

- Creator accounts
- Content records
- Viewer likes
- Comments

MongoDB Atlas provides the cloud database service.

## Security

The application includes:
- Creator authentication.
- JWT-based authentication.
- Protected creator routes.
- Password hashing.
- Server-side validation.
- Environment variables for sensitive configuration.

**Important:** Never upload `.env` files, database credentials, JWT secrets or other private configuration details to GitHub.

