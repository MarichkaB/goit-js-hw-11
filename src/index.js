import './sass/main.scss';

import scrollSmoothly from './js/scroll';
import scrollTop from './js/scroll-top';
import fetchImg from './js/fetch-img';
import cardTemplate from './template-card.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.btn'),
  goTopBtn: document.querySelector('.scroll-top'),
};

let query = '';
let page = 1;
let perPage = 0;

scrollTop();

refs.searchForm.addEventListener('submit', e => {
  refs.gallery.innerHTML = '';
  onFormSubmit(e);
  refs.loadMoreBtn.classList.add('is-hidden');
});

async function onFormSubmit(e) {
  e.preventDefault();

  query = e.currentTarget.searchQuery.value;
  page = 1;
  if (query.trim() === '') {
    Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }
  const response = await fetchImg(query, page);
  perPage = response.hits.length;

  if (response.totalHits <= perPage) {
    addISHidden();
  } else {
    removeIsHidden();
  }

  if (response.totalHits === 0) {
    clearGalleryHTML();

    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  try {
    if (response.totalHits > 0) {
      Notify.info(`Hooray! We found ${response.totalHits} images.`);
      clearGalleryHTML();
      renderCard(response.hits);
    }
  } catch (error) {
    console.log(error);
  }
}

refs.loadMoreBtn.addEventListener('click', loadMore);

async function loadMore() {
  try {
    refs.loadMoreBtn.disabled = true;
    pageIncrement();
    const response = await fetchImg(query, page);

    renderCard(response.hits);
    perPage += response.hits.length;
    scrollSmoothly();

    if (perPage >= response.totalHits) {
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      addISHidden();
    }
    refs.loadMoreBtn.disabled = false;
  } catch (error) {
    console.log(error);
  }
}

function addISHidden() {
  refs.loadMoreBtn.classList.add('is-hidden');
}
function removeIsHidden() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}
function pageIncrement() {
  page += 1;
}
function clearGalleryHTML() {
  refs.gallery.innerHTML = '';
}
function lightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
  lightbox.refresh();
}
function renderCard(array) {
  const markup = array.map(item => cardTemplate(item)).join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox();
}
