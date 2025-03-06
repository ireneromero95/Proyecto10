import './Home.css';
import { pintarSelect } from '../../components/FiltroCiudad/FiltroCiudad';
import { reuseFetch } from '../../components/reusableFetch/reusableFetch';

/* http://localhost:3000/api/v1/eventos */

let loggedIn = false;

export const Home = async () => {
  const main = document.querySelector('main');
  main.innerHTML = '';
  const res = await fetch('http://localhost:3000/api/v1/eventos');
  const respuestaEventos = await res.json();
  pintarSelect(respuestaEventos, main);
  pintarEventos(respuestaEventos, main);
};

// export const pintarEventos = async (eventos, elementoPadre) => {
//   if (localStorage.getItem('user')) {
//     loggedIn = true;
//   } else {
//     loggedIn = false;
//   }
//   const divEventos = document.createElement('div');
//   divEventos.className = 'eventos';

//   for (const evento of eventos) {
//     const divEvento = document.createElement('div');
//     const titulo = document.createElement('h3');
//     const info = document.createElement('div');
//     const portada = document.createElement('img');
//     const btnDesplegable = document.createElement('button');
//     const menuDesplegable = document.createElement('div');
//     const like = document.createElement('img');

//     if (loggedIn) {
//       //Asistire
//       like.className = 'like';
//       like.addEventListener('click', () => {
//         addAsistire(evento._id);
//         addUser(evento);
//       });

//       const user = JSON.parse(localStorage.getItem('user'));
//       if (user?.asistire?.includes(evento._id)) {
//         like.src = './assets/relleno-like.png';
//       } else {
//         like.src = '/assets/like.png';
//       }

//       //Asistentes
//       btnDesplegable.style.display = 'flex';
//       btnDesplegable.className = 'btnAsistentes';
//       btnDesplegable.textContent = 'Asistentes';
//       btnDesplegable.addEventListener('click', () => {
//         if (menuDesplegable.className === 'oculto') {
//           menuDesplegable.className = 'mostrar';
//         } else {
//           menuDesplegable.className = 'oculto';
//         }
//       });

//       //aqui esta el menudesplegable
//       menuDesplegable.className = 'oculto';
//       menuDesplegable.setAttribute('id', 'menuDesplegable');
//       const ul = document.createElement('ul');
//       //Esto es para buscar los usuarios
//       for (const asistenteId of evento.asistentes) {
//         try {
//           const res = await reuseFetch(
//             `http://localhost:3000/api/v1/users/${asistenteId}`,
//             'GET'
//           );

//           const user = await res.json();

//           const li = document.createElement('li');
//           li.textContent = user.userName;
//           ul.appendChild(li);
//         } catch {
//           console.log('Error pero esta dentro');
//         }
//       }
//       if (ul === '') {
//         menuDesplegable.append();
//       }
//       menuDesplegable.append(ul);
//     } else {
//       btnDesplegable.style.display = 'none';
//     }

//     divEvento.className = 'evento';

//     titulo.textContent = evento.nombre;
//     portada.src = evento.cartel;
//     //Añadir

//     info.innerHTML = `<p>${evento.ciudad}</p>
//     <p>${evento.precio}€</p>`;
//     divEvento.append(
//       titulo,
//       portada,
//       info,
//       btnDesplegable && btnDesplegable,
//       menuDesplegable && menuDesplegable,
//       like
//     );
//     divEventos.append(divEvento);
//   }
//   elementoPadre.append(divEventos);
// };

export const pintarEventos = async (eventos, elementoPadre) => {
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

    if (loggedIn) {
      // Asistiré
      like.className = 'like';
      like.addEventListener('click', () => {
        addAsistire(evento._id);
        addUser(evento);
      });

      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.asistire?.includes(evento._id)) {
        like.src = './assets/relleno-like.png';
      } else {
        like.src = '/assets/like.png';
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

      for (const asistente of evento.asistentes) {
        const li = document.createElement('li');
        li.textContent = asistente.userName;
        ul.appendChild(li);
      }

      if (ul === '') {
        menuDesplegable.append();
      }
      menuDesplegable.append(ul);
    } else {
      btnDesplegable.style.display = 'none';
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

    if (user?.asistire?.includes(idEvento)) {
      user.asistire = user.asistire.filter((eventoId) => eventoId !== idEvento);
    } else {
      user.asistire = [...user.asistire, idEvento];
    }
    const objetoFinal = JSON.stringify({
      asistire: user.asistire
    });

    const res = await reuseFetch(
      `http://localhost:3000/api/v1/users/${user._id}`,
      'PUT',
      objetoFinal, // Pasa el cuerpo aquí
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      } // Pasa los headers
    );

    const respuesta = await res.json();
    localStorage.setItem('user', JSON.stringify(user));

    Home();
  } catch (error) {
    console.log(error);
  }
};

const addUser = async (evento) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user._id;
  if (!evento.asistentes) {
    // console.log('Esto esta pasando?');
    evento.asistentes = [];
  } else {
    if (evento.asistentes.includes(userId)) {
      evento.asistentes = evento.asistentes.filter((id) => id !== userId);
    } else {
      evento.asistentes = [...evento.asistentes, userId];
    }
  }

  const objetoFinal = JSON.stringify({
    asistentes: evento.asistentes
  });

  const res = await reuseFetch(
    `http://localhost:3000/api/v1/eventos/${evento._id}`,
    'PUT',
    objetoFinal,
    {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  );

  const respuesta = await res.json();
};
