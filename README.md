# Node.js School Management System API

## Description

The Node.js School Management System API is a robust and comprehensive solution for managing various aspects of a school system. It provides a RESTful API built with Node.js, Express.js, and MongoDB, offering developers a powerful tool to create, retrieve, update, and delete school-related data.

## Table of Contents

- [Postman Collection](#postman-collection)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [GitHub Repository](#github-repository)

## Postman Collection

You can test the API using the [Postman collection](https://www.postman.com/mission-cosmonaut-25659827/workspace/school-management-system/collection/26177748-05a5d822-a456-413b-a95c-4a7e1aae7c0b?action=share&creator=26177748&active-environment=26177748-a365b933-8cbc-42a5-95b7-8f55387fba00) provided.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://www.postman.com/mission-cosmonaut-25659827/workspace/school-management-system/collection/26177748-05a5d822-a456-413b-a95c-4a7e1aae7c0b?action=share&creator=26177748&active-environment=26177748-a365b933-8cbc-42a5-95b7-8f55387fba00)

## Features

- **RESTful API Endpoints:**

  - Create, retrieve, update, and delete operations for students, teachers, exams, academic terms, years, and other related entities.

- **MongoDB Integration:**

  - Seamless interaction with MongoDB for efficient data storage and retrieval.

- **Authentication and Authorization:**

  - JWT-based authentication to secure the API.
  - Admin-only operations for specific endpoints to control access.

- **Express.js Framework:**

  - Utilization of Express.js features for robust route handling and middleware support.

- **Testing with Postman:**

  - Pre-configured Postman collections for easy API testing.

- **Secure API:**

  - Implementation of security measures to protect against common vulnerabilities.

- **Documentation:**

  - Detailed API documentation available in the [API Documentation](documentation.html) file.

- **Error Handling:**

  - Robust error handling mechanisms to ensure smooth API operation.

- **Admin Operations:**
  - Specific operations available only to admin users for enhanced control.

## Prerequisites

Before running the NexSphereShop API, ensure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (with connection details configured in a .env file)

## Usage

Once the server is running, interact with the API using tools like [Postman](https://www.postman.com/) or integrate it into your application.

## API Endpoints

## Admin Routes

- `POST /api/v1/admins/signup`

  - Sign up as an admin.

- `POST /api/v1/admins/login`

  - Log in as an admin.

- `GET /api/v1/admins`

  - Get all admins. (Admin Only)

- `GET /api/v1/admins/:id`

  - Get admin profile by ID. (Admin Only)

- `PATCH /api/v1/admins/updateAdmin`

  - Update admin data. (Admin Only)

- `PATCH /api/v1/admins/updateMyPassword`
  - Update admin password. (Admin Only)

## Teacher Routes

- `POST /api/v1/teachers/login`

  - Log in as a teacher.

- `PATCH /api/v1/teachers/updateMyPassword`

  - Update teacher password. (Teacher Only)

- `GET /api/v1/teachers/profile`

  - Get teacher profile. (Teacher Only)

- `PATCH /api/v1/teachers/:teacherId/update`

  - Update teacher data. (Teacher Only)

- `POST /api/v1/teachers/signup-teacher`

  - Sign up a new teacher. (Admin Only)

- `GET /api/v1/teachers`

  - Get all teachers. (Admin Only)

- `GET /api/v1/teachers/:teacherId`

  - Get teacher by ID. (Admin Only)

- `PATCH /api/v1/teachers/:teacherId/update/admin`
  - Admin update teacher. (Admin Only)

## Student Routes

- `PATCH /api/v1/students/updateMyPassword`

  - Update student password. (Student Only)

- `GET /api/v1/students/profile`

  - Get student profile. (Student Only)

- `PATCH /api/v1/students/:studentId/update`

  - Update student data. (Student Only)

- `POST /api/v1/students/exam/:examId/write`

  - Write an exam. (Student Only)

- `POST /api/v1/students/signup-student`

  - Sign up a new student. (Admin Only)

- `GET /api/v1/students`

  - Get all students. (Admin Only)

- `GET /api/v1/students/:studentId`

  - Get student by ID. (Admin Only)

- `PATCH /api/v1/students/:studentId/update/admin`
  - Admin update student. (Admin Only)

## Academic Term Routes

- `POST /api/v1/academic-terms`

  - Create an academic term. (Admin Only)

- `GET /api/v1/academic-terms`

  - Get all academic terms.

- `GET /api/v1/academic-terms/:id`

  - Get academic term by ID.

- `PATCH /api/v1/academic-terms/:id`

  - Update academic term by ID.

- `DELETE /api/v1/academic-terms/:id`
  - Delete academic term by ID. (Admin Only)

## Academic Year Routes

- `GET /api/v1/academic-years`

  - Get all academic years. (Admin Only)

- `POST /api/v1/academic-years`

  - Create an academic year. (Admin Only)

- `GET /api/v1/academic-years/:id`

  - Get academic year by ID.

- `PATCH /api/v1/academic-years/:id`

  - Update academic year by ID. (Admin Only)

- `DELETE /api/v1/academic-years/:id`
  - Delete academic year by ID. (Admin Only)

## Class Level Routes

- `POST /api/v1/class-levels`

  - Create a class level. (Admin Only)

- `GET /api/v1/class-levels`

  - Get all class levels. (Admin Only)

- `GET /api/v1/class-levels/:id`

  - Get class level by ID.

- `PATCH /api/v1/class-levels/:id`

  - Update class level by ID. (Admin Only)

- `DELETE /api/v1/class-levels/:id`
  - Delete class level by ID. (Admin Only)

## Exam Results Routes

- `GET /api/v1/exam-results`

  - Get all exam results. (Student Only)

- `GET /api/v1/exam-results/:id/checking`

  - Check exam results by ID. (Student Only)

- `PATCH /api/v1/exam-results/:id/admin-toggle-publish`
  - Admin toggle exam result publish by ID. (Admin Only)

## Exams Routes

- `POST /api/v1/exams`

  - Create an exam. (Teacher Only)

- `GET /api/v1/exams`

  - Get all exams. (Teacher Only)

- `GET /api/v1/exams/:id`

  - Get exam by ID.

- `PATCH /api/v1/exams/:id`
  - Update exam by ID. (Teacher Only)

## Program Routes

- `POST /api/v1/programs`

  - Create a program. (Admin Only)

- `GET /api/v1/programs`

  - Get all programs. (Admin Only)

- `GET /api/v1/programs/:id`

  - Get program by ID.

- `PATCH /api/v1/programs/:id`

  - Update program by ID. (Admin Only)

- `DELETE /api/v1/programs/:id`
  - Delete program by ID. (Admin Only)

## Question Routes

- `POST /api/v1/questions/:examId`

  - Create a question. (Teacher Only)

- `GET /api/v1/questions`

  - Get all questions. (Teacher Only)

- `GET /api/v1/questions/:id`

  - Get question by ID.

- `PATCH /api/v1/questions/:id`
  - Update question by ID. (Teacher Only)

## Subject Routes

- `POST /api/v1/subjects/:programId`

  - Create a subject. (Teacher Only)

- `GET /api/v1/subjects`

  - Get all subjects. (Teacher Only)

- `GET /api/v1/subjects/:id`

  - Get subject by ID.

- `PATCH /api/v1/subjects/:id`

  - Update subject by ID. (Teacher Only)

- `DELETE /api/v1/subjects/:id`
  - Delete subject by ID. (Teacher Only)

## Year Group Routes

- `POST /api/v1/year-groups`

  - Create a year group. (Admin Only)

- `GET /api/v1/year-groups`

  - Get all year groups. (Admin Only)

- `GET /api/v1/year-groups/:id`

  - Get year group by ID.

- `PATCH /api/v1/year-groups/:id`

  - Update year group by ID. (Admin Only)

- `DELETE /api/v1/year-groups/:id`
  - Delete year group by ID. (Admin Only)

### Authentication

- `POST /api/v1/signup`: Sign up and create a new user account.

  - Request Body:
    ```json
    {
      "name": "Your Name",
      "email": "your@email.com",
      "password": "yourpassword",
      "passwordConfirm": "yourpassword"
    }
    ```

- `POST /api/v1/login`: Log in and obtain an authentication token.
  - Request Body:
    ```json
    {
      "email": "your@email.com",
      "password": "yourpassword"
    }
    ```

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

GitHub : [Ahmed Sayed](https://github.com/unRealAhmed)
