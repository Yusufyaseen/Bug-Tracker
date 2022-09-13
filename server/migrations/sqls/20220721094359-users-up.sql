/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users (id uuid NOT NULL DEFAULT uuid_generate_v4(), createdAt TIMESTAMP NOT NULL DEFAULT now(), updatedAt TIMESTAMP NOT NULL DEFAULT now(), username varchar(20) NOT NULL, passwordHash varchar NOT NULL unique, CONSTRAINT PK_users PRIMARY KEY (id));
