// queries.js

const queries = {
    getAllDepartments: 'SELECT * FROM department',
    getAllRoles: 'SELECT * FROM role',
    getAllEmployees: 'SELECT * FROM employee',
    addDepartment: 'INSERT INTO department (name) VALUES (?)',
    addRole: 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
    addEmployee: 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
    updateEmployeeRole: 'UPDATE employee SET role_id = ? WHERE id = ?',
    updateEmployeeManager: 'UPDATE employee SET manager_id = ? WHERE id = ?',
    viewEmployeesByManager: 'SELECT * FROM employee WHERE manager_id = ?',
    viewEmployeesByDepartment: 'SELECT * FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ?)',
    deleteDepartment: 'DELETE FROM department WHERE id = ?',
    deleteRole: 'DELETE FROM role WHERE id = ?',
    deleteEmployee: 'DELETE FROM employee WHERE id = ?',
    getTotalUtilizedBudget: 'SELECT SUM(salary) AS total_budget FROM role WHERE department_id = ?',
  };
  
  module.exports = queries;
  