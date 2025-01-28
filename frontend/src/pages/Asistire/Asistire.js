import { pintarSelect } from '../../components/FiltroCiudad/FiltroCiudad';
import { pintarEventos } from '../Home/Home';
import './Asistire.css';

export const Asistire = async () => {
  const main = document.querySelector('main');
  main.innerHTML = '';
  const user = JSON.parse(localStorage.getItem('user'));

  const res = await fetch(`http://localhost:3000/api/v1/users/${user._id}`);
  const usuario = await res.json();
  pintarSelect(usuario.asistire, main);
  pintarEventos(usuario.asistire, main);
};
