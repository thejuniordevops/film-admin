import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001/';

export const getAllFilms = async (params) => {
  const res = await axios.get('/films', { params: params });
  return res.data.data;
};

export const addFilm = async (film) => {
  const res = await axios.post('/films-add', film);
  return res.data.data;
};

export const deleteFilm = async (id) => {
  const res = await axios.post('/films-delete', { id: id });
  return res.data.data;
};

export const uploadFilmsFile = async (data) => {
  const res = await axios.post('/films-import', data);
  console.log({ res });
  return res.data.data;
};
