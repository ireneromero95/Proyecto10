import { pintarSelect } from '../../components/FiltroCiudad/FiltroCiudad';
import { hideLoading, showLoading } from '../../components/Loading/Loading';
import { pintarEventos } from '../Home/Home';
import './Asistire.css';
const API_URL = import.meta.env.VITE_API_URL;

export const Asistire = async () => {
  const main = document.querySelector('main');
  main.innerHTML = '';
  showLoading(main);
  const user = JSON.parse(localStorage.getItem('user'));

  try {
    const eventosPromises = user.asistire.map(async (eventoId) => {
      const res = await fetch(`${API_URL}/eventos/${eventoId}`);
      const evento = await res.json();
      return evento;
    });

    const eventos = await Promise.all(eventosPromises);

    hideLoading();

    pintarSelect(eventos, main);

    pintarEventos(eventos, main);
  } catch (error) {
    hideLoading();
    console.error('Error al cargar los eventos:', error);
    main.innerHTML =
      '<p>Error al cargar los eventos. Por favor, intenta de nuevo.</p>';
  }
};
