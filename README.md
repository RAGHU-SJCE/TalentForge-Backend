# TalentForge Backend

## Overview

TalentForge is a Full Stack Job Portal and Talent Management Platform designed to connect students, professionals, recruiters, and administrators on a single platform.

The backend provides secure authentication, job management, application tracking, resume uploads, recruiter tools, analytics dashboards, notifications, company profiles, email notifications, and admin controls.

This project was built as a Software Engineering / Full Stack Development project using Node.js, Express.js, MongoDB Atlas, and JWT Authentication.

---

## Features

### Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Role-Based Access Control
* Student Role
* Recruiter Role
* Professional Role
* Admin Role

### User Management

* User Profile Management
* Update Skills
* Update Bio
* Resume Upload using Multer
* Student Search and Filtering

### Project Management

* Add Projects
* View Projects
* Update Projects
* Delete Projects

### Job Management

* Create Jobs
* View Jobs
* Update Jobs
* Delete Jobs
* Recruiter Job Posting

### Applications

* Apply for Jobs
* Track Application Status
* View Applied Jobs
* Recruiter Applicant Management
* Shortlist Candidates
* Reject Candidates
* Select Candidates

### Email Notifications

* Welcome Email
* Job Application Confirmation
* Recruiter New Applicant Notification
* Application Status Updates
* Shortlisted Email
* Rejected Email
* Selected Email

### Dashboard Analytics

* Student Dashboard
* Recruiter Dashboard
* Admin Dashboard

### Saved Jobs

* Save Jobs
* View Saved Jobs
* Remove Saved Jobs

### Notifications

* View Notifications
* Mark as Read
* Delete Notifications

### Company Profiles

* Recruiter Company Management
* Public Company Profiles

### Admin Panel

* View All Users
* Delete Users
* View All Jobs
* Delete Jobs
* Dashboard Analytics

### API Documentation

* Swagger UI Documentation
* Interactive API Testing

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JWT (JSON Web Tokens)
* bcryptjs

### File Upload

* Multer

### Email Service

* Nodemailer

### API Documentation

* Swagger UI
* Swagger JSDoc

### Version Control

* Git
* GitHub

---

## Project Structure

backend/

├── config/

├── controllers/

├── middleware/

├── models/

├── routes/

├── utils/

├── uploads/

├── server.js

├── package.json

└── README.md

---

## Installation

### Clone Repository

```bash
git clone https://github.com/RAGHU-SJCE/TalentForge-Backend.git
cd TalentForge-Backend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a .env file in the root directory.

```env
PORT=5000

MONGO_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_gmail_address

EMAIL_PASS=your_app_password
```

### Run Development Server

```bash
npm run dev
```

### Run Production Server

```bash
npm start
```

---

## API Documentation

After running the server:

```text
http://localhost:5000/api-docs
```

Swagger UI provides interactive API testing and complete endpoint documentation.

---

## Database Collections

* users
* projects
* jobs
* applications
* savedjobs
* notifications

---

## User Roles

### Student

* Create Profile
* Upload Resume
* Apply Jobs
* Save Jobs
* Track Applications

### Recruiter

* Create Jobs
* Manage Applicants
* Update Application Status
* Manage Company Profile

### Professional

* Maintain Profile
* Showcase Skills and Projects

### Admin

* Manage Users
* Manage Jobs
* View Analytics

---

## Security Features

* Password Hashing using bcryptjs
* JWT Authentication
* Protected Routes
* Role-Based Authorization
* Secure MongoDB Atlas Integration

---

## Future Enhancements

### Planned Features

* Email Verification using OTP
* Forgot Password via OTP
* Reset Password Module
* Cloudinary Resume Storage
* Advanced Job Recommendation System
* AI Resume Analyzer
* AI Candidate Matching
* Real-Time Chat System
* Interview Scheduling
* Video Interview Integration
* Frontend Deployment
* Docker Containerization
* CI/CD Pipeline

---

## Author

Raghavendra S

Software Engineering Project

TalentForge Backend – Job Portal & Talent Management Platform

---

## License

This project is created for educational and learning purposes.
