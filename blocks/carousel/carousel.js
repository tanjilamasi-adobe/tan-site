import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const images = [...block.querySelectorAll('img')];
  const textContent = [...block.querySelectorAll('p, h1, h2, h3')]
    .filter((p) => !p.querySelector('img') && p.textContent.trim() !== 'Carousel');

  block.innerHTML = '';

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('carousel-main-container');

  const imageViewport = document.createElement('div');
  imageViewport.classList.add('image-viewport');

  const imageList = document.createElement('ul');
  imageList.classList.add('image-list');

  images.forEach((img) => {
    const { src, alt } = img;

    const li = document.createElement('li');
    li.classList.add('image-slide');

    const optimizedPic = createOptimizedPicture(
      src,
      alt || 'carousel image',
      false,
      [{ width: '750' }],
    );

    li.append(optimizedPic);
    imageList.append(li);
  });

  const nav = document.createElement('div');
  nav.classList.add('carousel-nav-overlay');

  nav.innerHTML = `
    <button class="prev" aria-label="Previous">❮</button>
    <button class="next" aria-label="Next">❯</button>
  `;

  nav.querySelector('.prev').onclick = () => imageList.scrollBy({ left: -imageList.offsetWidth, behavior: 'smooth' });

  nav.querySelector('.next').onclick = () => imageList.scrollBy({ left: imageList.offsetWidth, behavior: 'smooth' });

  imageViewport.append(imageList, nav);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('carousel-content-bottom');

  textContent.forEach((nodes) => contentDiv.append(nodes.cloneNode(true)));

  carouselWrapper.append(imageViewport, contentDiv);
  block.append(carouselWrapper);
}
