export default async function decorate(block) {
  const link = block.querySelector('a');
  const url = link ? link.href : 'https://main--tan-site--tanjilamasi-adobe.aem.page/sheets/emp-spreadsheet.json';

  const resp = await fetch(url);
  const json = await resp.json();
  const employees = json.data;

  block.textContent = '';

  // Create Table elements
  const table = document.createElement('table');
  table.className = 'employee-table';

  // Add Table Header
  table.innerHTML = `
    <thead>
      <tr>
        <th>Name</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  `;

  const tbody = table.querySelector('tbody');

  // Add rows for each employee
  employees.forEach((employee) => {
    const row = document.createElement('tr');
    // Using || to support both Raw JSON (Name) and Indexed JSON (name)
    const name = employee.Name || employee.name || 'N/A';
    const role = employee.Role || employee.role || 'Employee';

    row.innerHTML = `
      <td>${name}</td>
      <td>${role}</td>
    `;
    tbody.append(row);
  });

  block.append(table);
}
