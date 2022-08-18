import axios from 'axios';

export default async function fetchImg(data, page) {
  const base_url = 'https://pixabay.com/api/';
  const key = '29356445-da33425b54a4f653a6afa2bba';
  const options = `key=${key}&q=${data}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios.get(`${base_url}?${options}`).then(res => res.data);
}
