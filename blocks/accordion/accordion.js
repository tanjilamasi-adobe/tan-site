export default function decorate(block) {
  const items = block.querySelectorAll(':scope > div');

  items.forEach((item) => {
    const title = item.querySelector(':scope > div:first-child');

    title.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
}
