async function createForm(formUrl, actionUrl) {
  const resp = await fetch(formUrl);
  const json = await resp.json();
  const form = document.createElement('form');

  json.data.forEach((field) => {
    const wrapper = document.createElement('div');
    wrapper.className = `form-field-wrapper form-${field.Type}-wrapper`;

    const label = document.createElement('label');
    label.textContent = field.Label;
    label.setAttribute('for', field.Name);
    wrapper.append(label);

    let input;
    if (field.Type === 'textarea') {
      input = document.createElement('textarea');
    } else if (field.Type === 'select') {
      input = document.createElement('select');
      field.Options.split(',').forEach((opt) => {
        const option = document.createElement('option');
        option.value = opt.trim();
        option.textContent = opt.trim();
        input.append(option);
      });
    } else {
      input = document.createElement('input');
      input.type = field.Type || 'text';
    }

    input.name = field.Name;
    input.id = field.Name;
    input.placeholder = field.Placeholder || '';
    if (field.Required === 'yes') input.required = true;

    wrapper.append(input);
    form.append(wrapper);
  });

  const buttonWrapper = document.createElement('div');
  const button = document.createElement('button');
  button.textContent = 'Submit';
  button.type = 'submit';
  buttonWrapper.append(button);
  form.append(buttonWrapper);

  // --- SUBMISSION LOGIC ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const formObj = Object.fromEntries(formData.entries());

    let body;
    let headers = {};

    // Check if sending to Adobe Admin API
    if (actionUrl.includes('admin.hlx.page') || actionUrl.includes('submitted-data-sheet')) {
      body = JSON.stringify({ data: formObj });
      headers['Content-Type'] = 'application/json';
    } else {
      body = formData; // Standard FormData for httpbin
    }

    const response = await fetch(actionUrl, {
      method: 'POST',
      body: body,
      headers: headers,
    });

    if (response.ok) {
      alert('Success! Data submitted.');
      form.reset();
    } else {
      alert('Submission failed. Check the console.');
      console.error('Submit error:', response.status);
    }
  });

  return form;
}

export default async function decorate(block) {
  const links = [...block.querySelectorAll('a')];
  const formUrl = links[0]?.href;
  const actionUrl = links[1]?.href;

  if (formUrl && actionUrl) {
    const form = await createForm(formUrl, actionUrl);
    block.textContent = '';
    block.append(form);
  }
}