# Company Appraiser Server
This project consists of building a back-end system for evaluating products from companies that are still in production, with the benefit of obtaining prior feedback from the public about their products, companies offer a discount for each successful evaluation in the system, so the user can obtain the discount coupon to use it in the purchase.

## 📋 Table of Contents
 - [Features](#-features)
 - [Technologies used](#-technologies)
 - [Installation](#installation)
 - [Routes](#routes)

## 🚀 Features
 - User registration and login with Fastify JWT.
 - Edit user profile information and update database.
 - Company registration, editing and removing updating the database.
 - Product registration and editing updatign the database.
 - Evaluation registration by users.

## 🛠️ Technologies used
 - Typescript: A typed superset of JavaScript that compiles to plain JavaScript.
 - Zod: Is a TypeScript-first schema declaration and validation library.
 - Fastify: Is a web framework highly focused on providing the best developer experience with the least overhead and a powerful plugin architecture.
 - Prisma: is a next-generation ORM that consists of these tools:
    - Prisma Client: Auto-generated and type-safe query builder for Node.js & TypeScript
    - Prisma Migrate: Declarative data modeling & migration system
    - Prisma Studio: GUI to view and edit data in your database
 - PDFKit: is a PDF document generation library for Node and the browser that makes creating complex, multi-page, printable documents easy.
 - Bcrypt: is cryptographic hashing algorithm, recommended for password hashing

## Installation
1. Run the `npm i` or `npm install` command to install the libraries used in the project. 
2. MySQL: You must have a mysql server on your machine and have a `companyappraiser` database created on it.
3. Env file: Create a .env file and add a `DATABASE_URL` variable that contains the path to the database on your machine's mysql server.
4. E.g: `DATABASE_URL="mysql://user:password@localhost:3306/companyappraiser?schema=public"`
5. To run existing migrations and create tables in the database, run `npx prisma migrate dev`.
6. Then, to create an administrator to initially access the system, run `npx prisma db seed`, after executing the command in the terminal it will display the created administrator, as well as your access data such as email and password.
7. To run the project, run the command `npm run dev` and then the server will be running at http://localhost:3333.

## Routes
- `/register` It is a specific route to authenticate in the system and thus gain access to the other features present.
- `/company` It is a route that contains all HTTP verbs to manage companies.
- `/evalutions` It is one for recording evaluations made by users, containing POST and GET verbs to register and list respectively.
- `/products` It is a route to manage product control in the system, with POST, GET and DELETE verbs.
- `/reports` It is a route that generates reports from companies registered in the system about their products and the evaluations they received.
- `/upload` It is a route that serves static files such as images of the products to be registered.
- `/users` It is the only route where it is not necessary to be authenticated to use its features, precisely to register in the system.
