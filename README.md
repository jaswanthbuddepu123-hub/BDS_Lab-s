# Backend Development Fundamentals – Lab Exercises

This repository contains the practical exercises completed as part of the Backend Development Fundamentals course.

## Lab 01: Introduction to Node.js and Express.js

### Objective
To understand Node.js and create a basic web server using Express.js.

### Theory
Node.js is a JavaScript runtime environment used to execute JavaScript outside the browser. Express.js is a lightweight framework built on Node.js that simplifies server creation and HTTP request handling.

A web server receives client requests and sends appropriate responses using HTTP methods.

### Procedure
1. Installed Node.js and initialized the project using `npm init`.
2. Installed the Express.js package.
3. Created an `app.js` file.
4. Imported Express and created an application.
5. Defined routes to handle HTTP requests.
6. Started the server and tested the endpoints.

### Outcome
Successfully created and tested a basic web server using Node.js and Express.js.

---

## Lab 02: SQLite Database and CRUD Operations

### Objective
To connect an Express application with an SQLite database and perform CRUD operations.

### Theory
SQLite is a lightweight relational database that stores data in tables. CRUD represents four basic database operations:

- **Create:** Insert new records.
- **Read:** Retrieve existing records.
- **Update:** Modify existing records.
- **Delete:** Remove records.

SQL queries are used to interact with the database.

### Procedure
1. Installed SQLite and required Node.js packages.
2. Created an SQLite database and a `book` table.
3. Established a database connection with the Express application.
4. Implemented GET endpoints to retrieve all books and a specific book.
5. Implemented POST to insert new books.
6. Implemented PUT to update book details.
7. Implemented DELETE to remove books.
8. Tested all CRUD operations using Postman.

### Outcome
Successfully connected the Express application with SQLite and implemented CRUD operations.

---

## Lab 03: REST API, Query Parameters, Validation and Debugging

### Objective
To develop a RESTful API with searching, sorting, pagination, price filtering and input validation.

### Theory
REST (Representational State Transfer) is an architectural style used to design web APIs. REST APIs use HTTP methods such as GET, POST, PUT and DELETE to perform operations on resources.

Query parameters are used to filter and customize the data returned by an API. Input validation ensures that incoming data is correct before processing it. HTTP status codes communicate the result of a request.

### Procedure
1. Reused the book database from Lab 02 by creating an independent database copy.
2. Implemented RESTful endpoints using appropriate HTTP methods.
3. Added the `search_q` parameter to search books using SQL LIKE.
4. Implemented sorting using `order_by` and `order`.
5. Added pagination using `limit` and `offset`.
6. Implemented price filtering using `min_price` and `max_price`.
7. Added POST request validation to reject invalid input.
8. Implemented appropriate HTTP status codes such as 200, 201, 400 and 404.
9. Used consistent JSON error responses.
10. Tested successful and unsuccessful requests using Postman.

### Outcome
Successfully developed a REST API supporting search, sorting, pagination, price filtering and input validation.

---

## Technologies Used
- Node.js
- Express.js
- JavaScript
- SQLite
- SQL
- Postman
- Git and GitHub

## Project Structure

```text
BDF-Labs/
├── lab-01/
├── lab-02/
├── lab-03/
└── README.md
```

## Author
**Name:** B.V JASWANTH
