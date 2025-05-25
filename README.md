# book-api
** Book API – Express.js + PostgreSQL

A simple RESTful API for managing books, with authentication, search and pagination.

** Features

- JWT-based authentication
- Add, update, delete, and fetch books
- Search books by book name or author name
- Pagination
- PostgreSQL as the database

---

** Project Setup
	1. Clone the Repository
	## bash
    
    * git clone https://github.com/smita136/book-api.git
    * cd book-api
    * npm install

* Create a .env file in the root:
PORT=3000
JWT_SECRET=express@JKUY_1876362
DB_USER=your_db_user
DB_HOST=localhost
DB_DATABASE=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432

* Run command in terminal to start server
node index.js

* Run in Postman
POST: http://localhost:3000/api/login

{
    "user_email": "test@mailinator.com",
    "user_password": "Test@123"
}

GET: http://localhost:3000/api/get-book-list
Add authentication token in Authorization section -> Type as Bearer Token


** DATABASE SCRIPTS

* CREATE DATABASE book_reviews;

* CREATE TABLE IF NOT EXISTS public.books
(
    book_id integer NOT NULL DEFAULT nextval('books_book_id_seq'::regclass),
    book_name character varying(100) COLLATE pg_catalog."default",
    reviews character varying(200) COLLATE pg_catalog."default",
    author_name character varying(50) COLLATE pg_catalog."default",
    genres character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT books_pkey PRIMARY KEY (book_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.books
    OWNER to postgres;

* CREATE TABLE IF NOT EXISTS public.users
(
    user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
    user_firstname character varying(50) COLLATE pg_catalog."default",
    user_lastname character varying(50) COLLATE pg_catalog."default",
    is_logged_in integer,
    user_email character varying(50) COLLATE pg_catalog."default",
    user_password character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

* CREATE TABLE IF NOT EXISTS public.user_reviews
(
    review_id integer NOT NULL DEFAULT nextval('user_reviews_review_id_seq'::regclass),
    user_id bigint,
    book_id bigint,
    reviews character varying(200) COLLATE pg_catalog."default",
    CONSTRAINT user_reviews_pkey PRIMARY KEY (review_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_reviews
    OWNER to postgres;
