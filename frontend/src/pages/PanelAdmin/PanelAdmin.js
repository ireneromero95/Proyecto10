import './PanelAdmin.css';
import { pintarSelect } from '../../components/FiltroCiudad/FiltroCiudad';
import { reuseFetch } from '../../utils/reusableFetch/reusableFetch';
import { pintarEventos } from '../Home/Home';
const API_URL = import.meta.env.VITE_API_URL;

export const PanelAdmin = async () => {
  const main = document.querySelector('main');
  main.innerHTML = '';
  const adminPanel = document.createElement('div');
  const adminHeader = document.createElement('div');
  const interfaz = document.createElement('div');
  const switchButton = document.createElement('button');

  adminHeader.id = 'adminHeader';
  adminPanel.id = 'panel';
  switchButton.id = 'switchButton';
  switchButton.textContent = 'Ver Panel de Usuarios';

  const title = document.createElement('h1');
  title.textContent = 'Panel del Administrador';
  adminHeader.appendChild(title);
  interfaz.appendChild(switchButton);
  interfaz.appendChild(adminPanel);

  switchButton.addEventListener('click', () => {
    if (switchButton.textContent === 'Ver Panel de Usuarios') {
      mostrarPanelUsuarios(adminPanel);
      switchButton.textContent = 'Ver Panel de Eventos';
    } else {
      mostrarPanelEventos(adminPanel);
      switchButton.textContent = 'Ver Panel de Usuarios';
    }
  });

  await mostrarPanelEventos(adminPanel);
  main.append(adminHeader, interfaz);
};

const mostrarPanelEventos = async (adminPanel) => {
  adminPanel.innerHTML = '';

  try {
    // eventos con reuseFetch
    const response = await reuseFetch(`${API_URL}/eventos`, 'GET', null, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    // ESTO SE USA PARA VERIFICAR QUE LA RESPUESTA SEA VALIDA
    if (!response) {
      console.error('No se recibió respuesta de la API');
      adminPanel.innerHTML =
        '<p>Error al cargar eventos. No se recibió respuesta.</p>';
      return;
    }

    let respuestaEventos;

    // Verificar si response es un objeto Response o ya son los datos importante xq si no me cuesta detectarlo
    if (response.json && typeof response.json === 'function') {
      // hay q hacerle json pa sacar los datos
      respuestaEventos = await response.json();
    } else {
      // ya son los datos en si mismos
      respuestaEventos = response;
    }

    // la respuesta es un array?
    if (!Array.isArray(respuestaEventos)) {
      console.error('La respuesta no es un array:', respuestaEventos);

      if (respuestaEventos && typeof respuestaEventos === 'object') {
        //si no es un array se lo sacamos
        for (const key in respuestaEventos) {
          if (Array.isArray(respuestaEventos[key])) {
            console.log(`Encontrado array en propiedad: ${key}`);
            respuestaEventos = respuestaEventos[key];
            break;
          }
        }
      }

      //si despues de todo no hay array por ningun lado, que me avise asi:
      if (!Array.isArray(respuestaEventos)) {
        adminPanel.innerHTML =
          '<p>Error: La respuesta no tiene el formato esperado.</p>';
        console.log('Respuesta recibida:', respuestaEventos);
        return;
      }
    }
    // ahora pintamos
    // pintarSelect(respuestaEventos, adminPanel, true);
    pintarEventos(respuestaEventos, adminPanel, true);
  } catch (error) {
    console.error('Error al cargar eventos:', error);
    adminPanel.innerHTML =
      '<p>Error al cargar los eventos. Por favor, intenta de nuevo.</p>';
  }
};

const mostrarPanelUsuarios = async (adminPanel) => {
  adminPanel.innerHTML = '';

  try {
    //hay que pasarle el token para la autorizacion
    const response = await reuseFetch(`${API_URL}/users`, 'GET', null, {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    let usuarios;
    //LAS LINEAS DE VERIFICACION SON ESTAS
    // las verificaciones de nuevo
    if (response.json && typeof response.json === 'function') {
      //extraer datos
      usuarios = await response.json();
    } else {
      ///o ya son los datos
      usuarios = response;
    }

    //verificar q es un array
    if (!Array.isArray(usuarios)) {
      console.error('La respuesta no es un array:', usuarios);
      if (usuarios && typeof usuarios === 'object') {
        for (const key in usuarios) {
          if (Array.isArray(usuarios[key])) {
            console.log(`Encontrado array en propiedad: ${key}`);
            usuarios = usuarios[key];
            break;
          }
        }
      }

      if (!Array.isArray(usuarios)) {
        adminPanel.innerHTML =
          '<p>Error: La respuesta de usuarios no tiene el formato esperado.</p>';
        console.log('Respuesta recibida:', usuarios);
        return;
      }
    }

    console.log('Usuarios obtenidos:', usuarios);

    const titulo = document.createElement('h2');
    titulo.textContent = 'Panel de Usuarios';
    adminPanel.appendChild(titulo);

    const contenedorUsuarios = document.createElement('div');
    contenedorUsuarios.classList.add('contenedor-usuarios'); //pa estilos

    if (usuarios.length === 0) {
      const noUsers = document.createElement('p');
      noUsers.textContent = 'No hay usuarios registrados.';
      contenedorUsuarios.appendChild(noUsers);
    } else {
      usuarios.forEach((usuario) => {
        const userCard = document.createElement('div');
        userCard.classList.add('usuario-card');

        const nombre = document.createElement('p');
        nombre.textContent = `Nombre: ${usuario.userName}`;

        const email = document.createElement('p');
        email.textContent = `Correo: ${usuario.correo}`;

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        //Aqui la accion
        btnEliminar.addEventListener('click', async () => {
          const confirmed = confirm(
            `¿Seguro que quieres eliminar a ${usuario.userName}?`
          );
          if (!confirmed) return;

          try {
            const response = await reuseFetch(
              `${API_URL}/users/${usuario._id}`,
              'DELETE',
              null,
              {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            );

            // Verificar la respuesta
            if (response && (response.ok || response.success)) {
              alert(`Usuario ${usuario.userName} eliminado con éxito`);
              mostrarPanelUsuarios(adminPanel); // Recargar la lista de usuarios
            } else {
              const errorMsg = response?.message || 'Error desconocido';
              alert(`Error al eliminar el usuario: ${errorMsg}`);
            }
          } catch (error) {
            console.error('Error en la petición DELETE:', error);
            alert('Error al intentar eliminar el usuario');
          }
        });

        userCard.appendChild(nombre);
        userCard.appendChild(email);
        userCard.appendChild(btnEliminar);

        contenedorUsuarios.appendChild(userCard);
      });
    }

    adminPanel.appendChild(contenedorUsuarios);
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    adminPanel.innerHTML =
      '<p>Error al cargar los usuarios. Por favor, intenta de nuevo.</p>';
  }
};

export const eliminarEvento = async (idEvento) => {
  const confirmado = confirm('¿Seguro que quieres eliminar este evento?');
  if (!confirmado) return;

  try {
    const response = await reuseFetch(
      `${API_URL}/eventos/${idEvento}`,
      'DELETE',
      null,
      {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    );

    if (response && (response.ok || response.success)) {
      alert('Evento eliminado con éxito');
      return true;
    } else {
      const errorMsg = response?.message || 'Error desconocido';
      alert(`Error al eliminar el evento: ${errorMsg}`);
      return false;
    }
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    alert('Error al intentar eliminar el evento');
    return false;
  }
};
