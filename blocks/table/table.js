export default function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const rows = [...block.children];

  rows.forEach((row, i) => {
    const tr = document.createElement('tr');
    // Map the columns from the EDS divs to table cells
    [...row.children].forEach((col) => {
      const cell = document.createElement(i === 0 ? 'th' : 'td');
      cell.innerHTML = col.innerHTML;
      tr.append(cell);
    });

    if (i === 0) {
      thead.append(tr);
    } else {
      tbody.append(tr);
    }
  });

  table.append(thead, tbody);
  block.innerHTML = '';
  block.append(table);
}
