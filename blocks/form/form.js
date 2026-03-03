async function createForm(formUrl, actionUrl) {
  const response = await fetch(formUrl);
  const json = await response.json();

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = actionUrl;

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

    if (field.Required === 'yes') {
      input.required = true;
    }

    wrapper.append(input);
    form.append(wrapper);
  });

  const buttonWrapper = document.createElement('div');
  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Submit';
  buttonWrapper.append(button);
  form.append(buttonWrapper);

  // ✅ Add submission handler without shadowing
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const obj = {};
    formData.forEach((value, key) => { obj[key] = value; });

    try {
      const submitResponse = await fetch(actionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
      });

      if (submitResponse.ok) {
        // Replace alert with DOM feedback
        const msg = document.createElement('p');
        msg.className = 'form-success';
        msg.textContent = 'Form submitted successfully!';
        form.append(msg);
        form.reset();
      } else {
        const msg = document.createElement('p');
        msg.className = 'form-error';
        msg.textContent = 'Error submitting form.';
        form.append(msg);
      }
    } catch (err) {
      const msg = document.createElement('p');
      msg.className = 'form-error';
      msg.textContent = 'Network error.';
      form.append(msg);
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
