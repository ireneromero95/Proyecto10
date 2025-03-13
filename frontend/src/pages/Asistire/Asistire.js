import { pintarSelect } from '../../components/FiltroCiudad/FiltroCiudad';
import { pintarEventos } from '../Home/Home';
import './Asistire.css';
const API_URL = import.meta.env.VITE_API_URL;

export const Asistire = async () => {
  const main = document.querySelector('main');
  main.innerHTML = '';
  const user = JSON.parse(localStorage.getItem('user'));

  const res = await fetch(`${API_URL}/users/${user._id}`);
  const usuario = await res.json();
  pintarSelect(usuario.asistire, main);
  pintarEventos(usuario.asistire, main);
};
