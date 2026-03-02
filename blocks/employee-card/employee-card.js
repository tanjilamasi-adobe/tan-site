export default function decorate(block) {
  const [nameRow, roleRow, deptRow, imageRow, linkRow] = [...block.children];

  // Extract the text and elements
  const name = nameRow.lastElementChild.textContent;
  const role = roleRow.lastElementChild.textContent;
  const dept = deptRow.lastElementChild.textContent;
  const image = imageRow.querySelector('picture'); // EDS uses <picture> for optimization
  const link = linkRow.querySelector('a');

  // Clear the block to rebuild it
  block.textContent = '';

  // Build the Card UI
  const cardDiv = document.createElement('div');
  cardDiv.className = 'employee-card-inner';
  
  cardDiv.innerHTML = `
    <div class="card-image">${image.innerHTML}</div>
    <div class="card-body">
      <h2>${name}</h2>
      <p class="role">${role}</p>
      <p class="dept">${dept}</p>
    </div>
  `;

  if (link) {
    link.classList.add('button', 'primary');
    cardDiv.querySelector('.card-body').append(link);
  }

  block.append(cardDiv);
}