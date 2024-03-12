-- seeds.sql

-- Insert some initial data for testing
INSERT INTO department (name) VALUES ('Finance');
INSERT INTO department (name) VALUES ('Engineering');

INSERT INTO role (title, salary, department_id) VALUES ('Accountant', 60000, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 80000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 2, 1);
