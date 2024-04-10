#Quirkployee Project
Overview
Quirkployee is a command-line application developed using Node.js, Inquirer, and MySQL. It offers a convenient interface for managing a company's departments, roles, and employees. Business owners can easily view, add, update, and delete information from their employee database, streamlining organizational tasks and facilitating efficient business planning.

Features
Viewing: Users can view all departments, roles, and employees in a formatted table format.
Adding: New departments, roles, and employees can be added to the database with user-provided information.
Updating: Users can update an employee's role, providing flexibility in managing employee positions.
Bonus Functionality: Additional features include updating employee managers, viewing employees by manager or department, and calculating the total utilized budget of a department.
Getting Started
To use the Employee Tracker, follow these steps:

Clone the repository to your local machine.
Install dependencies by running npm install.
Ensure you have MySQL installed and running on your machine.
Set up your database using the schema provided.
Populate your database with sample data using the seeds.sql file (optional).
Update the connection.js file with your MySQL database credentials.
Run the application by executing node index.js in your terminal.
Walkthrough Video
For a demonstration of the application's functionality, watch the walkthrough video here.

Database Schema
The application utilizes a MySQL database with the following schema:

Department: id (INT PRIMARY KEY), name (VARCHAR(30))
Role: id (INT PRIMARY KEY), title (VARCHAR(30)), salary (DECIMAL), department_id (INT)
Employee: id (INT PRIMARY KEY), first_name (VARCHAR(30)), last_name (VARCHAR(30)), role_id (INT), manager_id (INT)
Refer to the provided schema for more details.

GitHub Repository
Find the GitHub repository for this project https://github.com/bchris240/Quirkployee.git

Contributing
Contributions are welcome! If you have suggestions for improving the application or want to report a bug, please open an issue or submit a pull request.

License
This project is licensed under the MIT License.