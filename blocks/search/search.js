export default async function decorate(block) {
  // Setup UI elements (kept your style)
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Search here...';
  input.className = 'search-input';

  const button = document.createElement('button');
  button.textContent = 'Search';
  button.className = 'search-button';

  const results = document.createElement('div');
  results.className = 'search-results';

  // Fetch the data from the URL you provided
  const DATA_URL = 'https://main--helix-block-collection--adobe.hlx.live/docs/library/blocks/sample-search-data/query-index.json';
  
  let searchData = [];
  try {
    const resp = await fetch(DATA_URL);
    const json = await resp.json();
    searchData = json.data;
  } catch (e) {
    console.error('Failed to fetch search index', e);
  }

  // Search logic
  const performSearch = () => {
    const value = input.value.toLowerCase();
    results.innerHTML = '';

    if (!value) return;

    const filtered = searchData.filter((item) => {
      const title = (item.title || '').toLowerCase();
      const description = (item.description || '').toLowerCase();
      return title.includes(value) || description.includes(value);
    });

    if (filtered.length === 0) {
      results.innerHTML = '<div>No results found</div>';
      return;
    }

    filtered.forEach((item) => {
      const match = document.createElement('div');
      match.className = 'search-result-item';
      match.innerHTML = `
        <a href="${item.path}" target="_blank">
          <strong>${item.title || 'Untitled'}</strong>
          <p>${item.description || ''}</p>
        </a>
      `;
      results.appendChild(match);
    });
  };

  button.addEventListener('click', performSearch);
  
  // Also search when pressing "Enter"
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });

  block.append(input, button, results);
}