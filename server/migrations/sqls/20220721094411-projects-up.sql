/* Replace with your SQL commands */
CREATE TABLE projects (id uuid NOT NULL DEFAULT uuid_generate_v4(), createdAt TIMESTAMP NOT NULL DEFAULT now(), updatedAt TIMESTAMP NOT NULL DEFAULT now(), name varchar(60) NOT NULL, createdById uuid NOT NULL, CONSTRAINT PK_projects PRIMARY KEY (id));
ALTER TABLE projects ADD CONSTRAINT FK_projects1 FOREIGN KEY (createdById) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
