export default function decorate(block) {
  const link = block.querySelector('a');
  const img = block.querySelector('img');
  if (!link) return;

  const url = new URL(link.href);
  let videoId = '';

  if (url.hostname.includes('youtube.com')) videoId = url.searchParams.get('v');
  if (url.hostname.includes('youtu.be')) videoId = url.pathname.split('/')[1];

  // rel=0 ensures only videos from the SAME channel are suggested
  // modestbranding=1 removes the YouTube logo from the control bar
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  if (img) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('embed-placeholder');
    
    const playButton = document.createElement('div');
    playButton.classList.add('embed-play-button');
    
    wrapper.append(img.closest('picture'), playButton);
    block.textContent = '';
    block.append(wrapper);

    wrapper.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = embedUrl;
      // Added standard permissions for better player behavior
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      block.innerHTML = '';
      block.append(iframe);
    });
  }
}