import './Home.css';
import { pintarSelect } from '../../components/FiltroCiudad/FiltroCiudad';
import { reuseFetch } from '../../utils/reusableFetch/reusableFetch';
import { eliminarEvento } from '../PanelAdmin/PanelAdmin';
import { hideLoading, showLoading } from '../../components/Loading/Loading';

const API_URL = import.meta.env.VITE_API_URL;

/* http://localhost:3000/api/v1/eventos */

let loggedIn = false;
const nolike = false;

export const Home = async () => {
  const main = document.querySelector('main');
  main.innerHTML = '';

  showLoading(main);

  try {
    const res = await fetch(`${API_URL}/eventos`);
    if (!res.ok) {
      throw new Error(`Error del servidor: ${res.status}`);
    }

    const respuestaEventos = await res.json();
    hideLoading();
    pintarSelect(respuestaEventos, main);
    pintarEventos(respuestaEventos, main);
  } catch (error) {
    hideLoading();
    console.error('Error al cargar eventos:', error);
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-container';
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error';
    errorMessage.textContent =
      'Lo sentimos, ha ocurrido un error al cargar los eventos. Por favor, inténtalo más tarde.';
    errorContainer.appendChild(errorMessage);
    main.appendChild(errorContainer);
  }
};

export const pintarEventos = async (eventos, elementoPadre, nolike = false) => {
  if (localStorage.getItem('user')) {
    loggedIn = true;
  } else {
    loggedIn = false;
  }
  const divEventos = document.createElement('div');
  divEventos.className = 'eventos';

  for (const evento of eventos) {
    const divEvento = document.createElement('div');
    const titulo = document.createElement('h3');
    const info = document.createElement('div');

    // div para ciudad y precio
    const infoDatos = document.createElement('div');
    // div para asistentes

    const portada = document.createElement('img');

    let like;

    if (loggedIn && !nolike) {
      like = document.createElement('img');
      like.className = 'like';
      like.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        await addAsistire(evento._id);
        await addUser(evento);

        const updatedUser = JSON.parse(localStorage.getItem('user'));
        if (updatedUser?.asistire?.includes(evento._id)) {
          like.src = './assets/relleno-like.png';
        } else {
          like.src = './assets/like.png';
        }
      });

      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.asistire?.includes(evento._id)) {
        like.src = './assets/relleno-like.png';
      } else {
        like.src = './assets/like.png';
      }
    }

    if (loggedIn && nolike) {
      like = document.createElement('img');
      like.className = 'borrar';
      like.src = './assets/eliminar.png';

      like.addEventListener('click', async () => {
        const exito = await eliminarEvento(evento._id);
        if (exito) {
          const res = await fetch(`${API_URL}/eventos`);
          const nuevosEventos = await res.json();

          elementoPadre.innerHTML = '';
          pintarSelect(nuevosEventos, elementoPadre);
          pintarEventos(nuevosEventos, elementoPadre, true);
        }
      });
    }

    divEvento.className = 'evento';

    titulo.textContent = evento.nombre;
    portada.src = evento.cartel;
    infoDatos.innerHTML = `<p>${evento.ciudad}</p><p>${evento.precio}€</p>`;
    info.appendChild(infoDatos);
    if (loggedIn) {
      const infoAsistentes = document.createElement('div');

      const asistentesTexto = document.createElement('p');
      if (evento.asistentes && evento.asistentes.length > 0) {
        const nombres = evento.asistentes.map((a) => a.userName);
        let frase = '';

        if (nombres.length === 1) {
          frase = `Asistirá ${nombres[0]}`;
        } else if (nombres.length === 2) {
          frase = `Asistirán ${nombres[0]} y ${nombres[1]}`;
        } else if (nombres.length === 3) {
          frase = `Asistirán ${nombres[0]}, ${nombres[1]} y ${nombres[2]}`;
        } else {
          frase = `Asistirán ${nombres[0]}, ${nombres[1]}, ${nombres[2]} y otras personas`;
        }

        asistentesTexto.textContent = frase;
      } else {
        asistentesTexto.textContent = 'No hay asistentes todavía';
      }
      infoAsistentes.appendChild(asistentesTexto);
      info.appendChild(infoAsistentes);
    }
    if (like) {
      divEvento.append(titulo, portada, info, like);
    } else {
      divEvento.append(titulo, portada, info);
    }
    divEventos.append(divEvento);
  }
  elementoPadre.append(divEventos);
};

const addAsistire = async (idEvento) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    //Aquí intentando que se eliminen también de favoritos

    // Asegurarse de que asistire existe
    if (!user.asistire) {
      user.asistire = [];
    }

    // Verificar si el evento ya está en favoritos
    const index = user.asistire.indexOf(idEvento);

    if (index !== -1) {
      // Eliminar el evento de favoritos
      user.asistire.splice(index, 1);
    } else {
      // Añadir el evento a favoritos
      user.asistire.push(idEvento);
    }

    const objetoFinal = JSON.stringify({
      asistire: user.asistire
    });

    const res = await reuseFetch(
      `${API_URL}/users/${user._id}`,
      'PUT',
      objetoFinal,
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    );

    const respuesta = await res.json();
    localStorage.setItem('user', JSON.stringify(user));

    // No recargar la página aquí
    // Home();

    return respuesta;
  } catch (error) {
    console.error('Error en addAsistire:', error);
    return null;
  }
};

const addUser = async (evento) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user._id;

    if (!evento.asistentes) {
      evento.asistentes = [];
    }

    // He tenido que hacerlo todo diferente porque era un objeto y no me servia el includes
    const userIndex = evento.asistentes.findIndex(
      (asistente) =>
        // contemplar q sea un objeto xq no me entero ya
        (typeof asistente === 'object' && asistente._id === userId) ||
        asistente === userId
    );

    if (userIndex !== -1) {
      evento.asistentes.splice(userIndex, 1);
    } else {
      evento.asistentes.push({ _id: userId, userName: user.userName });
    }

    const objetoFinal = JSON.stringify({
      asistentes: evento.asistentes
    });

    const res = await reuseFetch(
      `${API_URL}/eventos/${evento._id}`,
      'PUT',
      objetoFinal,
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    );

    const respuesta = await res.json();
    return respuesta;
  } catch (error) {
    console.error('Error en addUser:', error);
    return null;
  }
};
