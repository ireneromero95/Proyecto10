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
//He añadido aqui un nolike
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
    const portada = document.createElement('img');
    const btnDesplegable = document.createElement('button');
    const menuDesplegable = document.createElement('div');
    const like = document.createElement('img');

    if (loggedIn && !nolike) {
      // Asistiré
      like.className = 'like';
      like.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Llamar a las funciones de forma asíncrona
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

      // Asistentes
      btnDesplegable.style.display = 'flex';
      btnDesplegable.className = 'btnAsistentes';
      btnDesplegable.textContent = 'Asistentes';
      btnDesplegable.addEventListener('click', () => {
        if (menuDesplegable.className === 'oculto') {
          menuDesplegable.className = 'mostrar';
        } else {
          menuDesplegable.className = 'oculto';
        }
      });

      menuDesplegable.className = 'oculto';
      menuDesplegable.setAttribute('id', 'menuDesplegable');
      const ul = document.createElement('ul');

      // Verificar que evento.asistentes existe antes de iterar
      if (evento.asistentes && evento.asistentes.length > 0) {
        for (const asistente of evento.asistentes) {
          const li = document.createElement('li');
          li.textContent = asistente.userName;
          ul.appendChild(li);
        }
        menuDesplegable.append(ul);
      } else {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No hay asistentes';
        menuDesplegable.append(emptyMessage);
      }
    } else {
      btnDesplegable.style.display = 'none';
    }

    // if (loggedIn && nolike) {
    //   like.className = 'borrar';
    //   like.addEventListener('click', () => {
    //     console.log('se borra');
    //   });
    //   like.src = './assets/eliminar.png';
    // }

    if (loggedIn && nolike) {
      like.className = 'borrar';
      like.src = './assets/eliminar.png';

      like.addEventListener('click', async () => {
        const exito = await eliminarEvento(evento._id);
        if (exito) {
          // Recarga eventos despues de eliminar
          const res = await fetch(`${API_URL}/eventos`);
          const nuevosEventos = await res.json();

          // limpio y a pintr
          elementoPadre.innerHTML = '';
          pintarSelect(nuevosEventos, elementoPadre);
          pintarEventos(nuevosEventos, elementoPadre, true);
        }
      });
    }

    divEvento.className = 'evento';

    titulo.textContent = evento.nombre;
    portada.src = evento.cartel;
    // Añadir

    info.innerHTML = `<p>${evento.ciudad}</p>
    <p>${evento.precio}€</p>`;
    divEvento.append(
      titulo,
      portada,
      info,
      btnDesplegable && btnDesplegable,
      menuDesplegable && menuDesplegable,
      like
    );
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
