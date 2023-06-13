//import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery'); // espacio para las tarjetas de imagenes
const loadMoreBtn = document.getElementById('load-more'); //botom para cargar mas imagenes

let page = 1;
let perPage = 40;
loadMoreBtn.style.display = 'none';

form.addEventListener('submit', e => {
	e.preventDefault();
	const searchQuery = form.searchQuery.value.trim();
	if (searchQuery === '') return;

	gallery.innerHTML = '';
	//page = 1;
	searchImages(searchQuery);
	loadMoreBtn.style.display = 'none';
});

//evento del botom load.more
loadMoreBtn.addEventListener('click', () => {
	const searchQuery = form.searchQuery.value.trim();
	if (searchQuery === '') return;

	page += 1;
	searchImages(searchQuery);
});

// funcion para insertar elementos al dom
function createPhotoCard(image) {
	const tempContainer = document.createElement('div');

	const cardHTML = `
		<div class="photo-card">
			<a href="${image.webformatURL}">
				<img src="${image.webformatURL}" alt="${image.tags}">
			</a>
			<div class="info">
				<p class="info-item"><b>Likes</b> ${image.likes}</p>
				<p class="info-item"><b>Views</b> ${image.views}</p>
				<p class="info-item"><b>Comments</b> ${image.comments}</p>
				<p class="info-item"><b>Downloads</b> ${image.downloads}</p>
			</div>
		</div>
	`;

	tempContainer.innerHTML = cardHTML;

	return tempContainer.firstElementChild;
}
// funcion para noticar erro
function showNotification(message) {
	Notiflix.Notify.failure(message, {
		position: 'right-up',
		timeout: 2000,
		borderRadius: '3px',
	});
}

// funcions asincronica par buscar imagenes
async function searchImages(searchQuery) {
	const apiKey = '37119471-67d3015a83a24c7694e1d7310'; // Replace with your Pixabay API key
	const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

	try {
		const response = await fetch(apiUrl);
		const data = await response.json();

		if (data.totalHits === 0) {
			showNotification(
				'Sorry, there are no images matching your search query. Please try again.'
			);
			return;
		}

		data.hits.forEach(image => {
			const card = createPhotoCard(image);
			gallery.appendChild(card);
		});

		if (data.totalHits <= page * 40) {
			showNotification(
				"We're sorry, but you've reached the end of search results."
			);
		}

		lightbox = new SimpleLightbox('.photo-card a');
		//showNotification(`Hooray! We found ${data.totalHits} images.`);
	} catch (error) {
		console.error('Error:', error);
	}
}

// evento del cliente en el botom

window.addEventListener('scroll', function () {
	// Verificar si el usuario ha llegado al final de la página
	if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
		// Cargar más imágenes aquí
		const searchQuery = form.searchQuery.value.trim();
		if (searchQuery === '') return;

		page += 1;
		searchImages(searchQuery);
	}
});
