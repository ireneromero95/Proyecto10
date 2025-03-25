import { reuseFetch } from '../../utils/reusableFetch/reusableFetch';
import './CrearEvento.css';
const API_URL = import.meta.env.VITE_API_URL;

export const CrearEvento = async () => {
  const main = document.querySelector('main');
  main.innerHTML = '';
  const form = document.createElement('form');
  const inputName = document.createElement('input');
  const inputCiudad = document.createElement('input');
  const inputPrecio = document.createElement('input');
  const inputCartel = document.createElement('input');
  const button = document.createElement('button');

  form.setAttribute('id', 'formEvento');
  button.textContent = 'Crear Evento';
  inputName.placeholder = 'Nombre del evento';
  inputCiudad.placeholder = 'Ciudad del evento';
  inputPrecio.placeholder = 'Precio del evento';
  inputPrecio.type = 'number';
  inputPrecio.min = 0;
  inputCartel.type = 'file';
  inputCartel.accept = 'image/*';
  button.textContent = 'Crear Evento';

  form.append(inputName, inputCiudad, inputPrecio, inputCartel, button);
  main.appendChild(form);

  form.addEventListener('submit', () =>
    submitEvento(
      inputName.value,
      inputCiudad.value,
      inputPrecio.value,
      inputCartel.files[0]
    )
  );
};

const submitEvento = async (nombre, ciudad, precio, cartel) => {
  const pError = document.querySelector('.error');
  if (pError) {
    pError.remove();
  }
  const main = document.querySelector('main');

  // Creo el texto de "Creando evento..."
  const loadingText = document.createElement('p');
  loadingText.textContent = 'Creando evento...';
  main.appendChild(loadingText);

  const formData = new FormData();

  // Metiendo los datos los datos del evento como texto
  formData.append('nombre', nombre);
  formData.append('ciudad', ciudad);
  formData.append('precio', precio);
  formData.append('cartel', cartel);

  // const opciones = {
  //   method: 'POST',
  //   body: formData
  // };

  // const res = await fetch('http://localhost:3000/api/v1/eventos', opciones);

  const res = await reuseFetch(`${API_URL}/eventos`, 'POST', formData);

  loadingText.remove();
  const form = document.querySelector('#formEvento');

  if (res.status === 400) {
    loadingText.remove();
    const pError = document.createElement('p');
    pError.classList.add('error');
    pError.textContent = 'Falta algún campo por rellenar';
    form.append(pError);
    return;
  }

  const eventoCreado = document.createElement('p');
  eventoCreado.textContent = '¡Evento creado correctamente!';
  form.append(eventoCreado);
  setTimeout(() => {
    CrearEvento();
  }, 2000);
};
