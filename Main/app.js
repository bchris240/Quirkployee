// app.js

const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const consoleTable = require('console.table');
const queries = require('./queries');

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to start the application
async function startApp() {
  try {
    const answer = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Update employee manager',
        'View employees by manager',
        'View employees by department',
        'Delete department',
        'Delete role',
        'Delete employee',
        'View total utilized budget',
        'Exit',
      ],
    });

    switch (answer.action) {
      case 'View all departments':
        await viewAll(queries.getAllDepartments);
        break;
      case 'View all roles':
        await viewAll(queries.getAllRoles);
        break;
      case 'View all employees':
        await viewAll(queries.getAllEmployees);
        break;
      case 'Add a department':
        await addDepartment();
        break;
      case 'Add a role':
        await addRole();
        break;
      case 'Add an employee':
        await addEmployee();
        break;
      case 'Update an employee role':
        await updateEmployeeRole();
        break;
      case 'Update employee manager':
        await updateEmployeeManager();
        break;
      case 'View employees by manager':
        await viewEmployeesByManager();
        break;
      case 'View employees by department':
        await viewEmployeesByDepartment();
        break;
      case 'Delete department':
        await deleteDepartment();
        break;
      case 'Delete role':
        await deleteRole();
        break;
      case 'Delete employee':
        await deleteEmployee();
        break;
      case 'View total utilized budget':
        await viewTotalUtilizedBudget();
        break;
      case 'Exit':
        await pool.end();
        break;
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to view all (departments, roles, employees)
async function viewAll(query) {
  const [rows] = await pool.execute(query);
  console.table(rows);
  await startApp();
}

// Function to add a department
async function addDepartment() {
  try {
    const answer = await inquirer.prompt({
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department:',
    });

    await pool.execute(queries.addDepartment, [answer.departmentName]);
    console.log('Department added successfully!');
    await startApp();
  } catch (error) {
    console.error(error);
  }
}

// Function to add a role
async function addRole() {
  try {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'roleTitle',
        message: 'Enter the title of the role:',
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: 'Enter the salary for the role:',
      },
      {
        type: 'input',
        name: 'roleDepartment',
        message: 'Enter the department id for the role:',
      },
    ]);

    await pool.execute(queries.addRole, [answer.roleTitle, answer.roleSalary, answer.roleDepartment]);
    console.log('Role added successfully!');
    await startApp();
  } catch (error) {
    console.error(error);
  }
}

// Function to add an employee
async function addEmployee() {
  try {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'employeeFirstName',
        message: 'Enter the first name of the employee:',
      },
      {
        type: 'input',
        name: 'employeeLastName',
        message: 'Enter the last name of the employee:',
      },
      {
        type: 'input',
        name: 'employeeRole',
        message: 'Enter the role id for the employee:',
      },
      {
        type: 'input',
        name: 'employeeManager',
        message: 'Enter the manager id for the employee (leave blank if none):',
      },
    ]);

    await pool.execute(queries.addEmployee, [answer.employeeFirstName, answer.employeeLastName, answer.employeeRole, answer.employeeManager || null]);
    console.log('Employee added successfully!');
    await startApp();
  } catch (error) {
    console.error(error);
  }
}

// Function to update an employee role
async function updateEmployeeRole() {
  try {
    const employees = await pool.execute(queries.getAllEmployees);
    const roles = await inquirer.prompt({
      type: 'list',
      name: 'role',
      message: 'Select the new role:',
      choices: (await pool.execute(queries.getAllRoles)).map((role) => ({
        name: role.title,
        value: role.id,
      })),
    });

    const employeesToUpdate = await inquirer.prompt({
      type: 'checkbox',
      name: 'employeesToUpdate',
      message: 'Select employees to update their role:',
      choices: employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    });

    for (const employeeId of employeesToUpdate.employeesToUpdate) {
      await pool.execute(queries.updateEmployeeRole, [roles.role, employeeId]);
    }

    console.log('Employee role(s) updated successfully!');
    await startApp();
  } catch (error) {
    console.error(error);
  }
}

// Function to update an employee manager
async function updateEmployeeManager() {
  try {
    const employees = await pool.execute(queries.getAllEmployees);
    const managers = await inquirer.prompt({
      type: 'list',
      name: 'manager',
      message: 'Select the new manager:',
      choices: employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    });

    const employeesToUpdate = await inquirer.prompt({
      type: 'checkbox',
      name: 'employeesToUpdate',
      message: 'Select employees to update their manager:',
      choices: employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    });

    for (const employeeId of employeesToUpdate.employeesToUpdate) {
      await pool.execute(queries.updateEmployeeManager, [managers.manager, employeeId]);
    }

    console.log('Employee manager(s) updated successfully!');
    await startApp();
  } catch (error) {
    console.error(error);
  }
}

// Function to view employees by manager
async function viewEmployeesByManager() {
  try {
    const managers = await inquirer.prompt({
      type: 'list',
      name: 'manager',
      message: 'Select the manager:',
      choices: (await pool.execute(queries.getAllEmployees)).map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    });

    await viewAll(queries.viewEmployeesByManager, [managers.manager]);
  } catch (error) {
    console.error(error);
  }
}

// Function to view employees by department
async function viewEmployeesByDepartment() {
  try {
    const departments = await inquirer.prompt({
      type: 'list',
      name: 'department',
      message: 'Select the department:',
      choices: (await pool.execute(queries.getAllDepartments)).map((department) => ({
        name: department.name,
        value: department.id,
      })),
    });

    await viewAll(queries.viewEmployeesByDepartment, [departments.department]);
  } catch (error) {
    console.error(error);
  }
}

// Function to delete a department
async function deleteDepartment() {
  try {
    const departments = await inquirer.prompt({
      type: 'list',
      name: 'department',
      message: 'Select the department to delete:',
      choices: (await pool.execute(queries.getAllDepartments)).map((department) => ({
        name: department.name,
        value: department.id,
      })),
    });

    await pool.execute(queries.deleteDepartment, [departments.department]);
    console.log('Department deleted successfully!');
    await startApp();
  } catch (error) {
    console.error(error);
  }
}

// Function to delete a role
async function deleteRole() {
  try {
    const roles = await inquirer.prompt({
      type: 'list',
      name: 'role',
      message: 'Select the role to delete:',
      choices: (await pool.execute(queries.getAllRoles)).map((role) => ({
        name: role.title,
        value: role.id,
      })),
    });

    await pool.execute(queries.deleteRole, [roles.role]);
    console.log('Role deleted successfully!');
    await startApp();
  } catch (error) {
    console.error(error);
  }
}

// Function to delete an employee
async function deleteEmployee() {
  try {
    const employees = await inquirer.prompt({
      type: 'list',
      name: 'employee',
      message: 'Select the employee to delete:',
      choices: (await pool.execute(queries.getAllEmployees)).map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })),
    });

    await pool.execute(queries.deleteEmployee, [employees.employee]);
    console.log('Employee deleted successfully!');
    await startApp();
  } catch (error) {
    console.error(error);
  }
}

// Function to view the total utilized budget of a department
async function viewTotalUtilizedBudget() {
  try {
    const departments = await inquirer.prompt({
      type: 'list',
      name: 'department',
      message: 'Select the department:',
      choices: (await pool.execute(queries.getAllDepartments)).map((department) => ({
        name: department.name,
        value: department.id,
      })),
    });

    const [result] = await pool.execute(queries.getTotalUtilizedBudget, [departments.department]);
    console.log(`Total Utilized Budget for ${departments.department}: $${result[0].total_budget}`);
    await startApp();
  } catch (error) {
    console.error(error);
  }
}

// Start the application
await startApp();
