/* Replace with your SQL commands */
CREATE TYPE bugs_priority_enum AS ENUM('low', 'medium', 'high');
CREATE TABLE bugs (id uuid NOT NULL DEFAULT uuid_generate_v4(), title character varying(60) NOT NULL, description varchar NOT NULL, priority bugs_priority_enum NOT NULL DEFAULT 'low', projectId uuid NOT NULL, isResolved boolean NOT NULL DEFAULT false, closedById uuid, closedAt TIMESTAMP, reopenedById uuid, reopenedAt TIMESTAMP, createdById uuid NOT NULL, createdAt TIMESTAMP NOT NULL DEFAULT now(), updatedById uuid, updatedAt TIMESTAMP, CONSTRAINT PK_bugs PRIMARY KEY (id));
ALTER TABLE bugs ADD CONSTRAINT FK_notes1 FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE bugs ADD CONSTRAINT FK_notes2 FOREIGN KEY (closedById) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE bugs ADD CONSTRAINT FK_notes3 FOREIGN KEY (reopenedById) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE bugs ADD CONSTRAINT FK_notes4 FOREIGN KEY (createdById) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE bugs ADD CONSTRAINT FK_notes5 FOREIGN KEY (updatedById) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION;