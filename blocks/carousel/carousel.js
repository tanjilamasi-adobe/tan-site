import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Find all images in the block
  const images = [...block.querySelectorAll('img')];
  // Find all text (excluding the header and the images themselves)
  const textContent = [...block.querySelectorAll('p, h1, h2, h3')].filter(p => !p.querySelector('img') && p.textContent.trim() !== 'Carousel');

  block.innerHTML = '';

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('carousel-main-container');

  // 1. Create the Image Gallery (The Slide Area)
  const imageViewport = document.createElement('div');
  imageViewport.classList.add('image-viewport');

  const imageList = document.createElement('ul');
  imageList.classList.add('image-list');

  images.forEach((img) => {
    const li = document.createElement('li');
    li.classList.add('image-slide');
    // Re-optimize the image for EDS
    const optimizedPic = createOptimizedPicture(img.src, img.alt || 'carousel image', false, [{ width: '750' }]);
    li.append(optimizedPic);
    imageList.append(li);
  });

  // 2. Add Navigation Buttons on top of images
  const nav = document.createElement('div');
  nav.classList.add('carousel-nav-overlay');
  nav.innerHTML = `
    <button class="prev" aria-label="Previous">❮</button>
    <button class="next" aria-label="Next">❯</button>
  `;

  nav.querySelector('.prev').onclick = () => imageList.scrollBy({ left: -imageList.offsetWidth, behavior: 'smooth' });
  nav.querySelector('.next').onclick = () => imageList.scrollBy({ left: imageList.offsetWidth, behavior: 'smooth' });

  imageViewport.append(imageList, nav);

  // 3. Create the Text Area (Content below images)
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('carousel-content-bottom');
  textContent.forEach(nodes => contentDiv.append(nodes.cloneNode(true)));

  carouselWrapper.append(imageViewport, contentDiv);
  block.append(carouselWrapper);
}