export default async function decorate(block) {
  // 1. Get the URL from the table you created in da.live
  const link = block.querySelector('a');
  const url = link ? link.href : 'https://main--tan-site--tanjilamasi-adobe.aem.page/sheets/emp-spreadsheet.json';

  // 2. Fetch the data
  const resp = await fetch(url);
  if (!resp.ok) return;
  
  const json = await resp.json();
  const employees = json.data;

  // 3. Clear the block (the URL text disappears here)
  block.textContent = '';

  // 4. Create the Grid
  const grid = document.createElement('div');
  grid.className = 'employee-grid';

  // 5. Build cards
  employees.forEach((employee) => {
    const card = document.createElement('div');
    card.className = 'employee-item';
    card.innerHTML = `
      <div class="name">${employee.Name || 'N/A'}</div>
      <div class="role">${employee.Role || 'Employee'}</div>
    `;
    grid.append(card);
  });

  block.append(grid);
}