import { pintarEventos } from '../../pages/Home/Home';
import { Home } from '../../pages/Home/Home';
import './FiltroCiudad.css';

export const pintarSelect = (eventos, elementoPadre) => {
  const divSelect = document.createElement('div');
  divSelect.className = 'select';
  const select = document.createElement('select');
  const ciudadesUnicas = new Set();

  eventos.forEach((evento) => {
    ciudadesUnicas.add(evento.ciudad);
  });
  const optionTodos = document.createElement('option');
  optionTodos.value = 'Todos';
  optionTodos.textContent = 'Todos';
  select.append(optionTodos);

  ciudadesUnicas.forEach((ciudad) => {
    const option = document.createElement('option');
    option.value = ciudad;
    option.textContent = ciudad;
    select.append(option);
  });

  const valorPrevio = sessionStorage.getItem('valorSeleccionado');

  if (valorPrevio) {
    select.value = valorPrevio;
  }

  select.addEventListener('change', (event) => {
    const valorSeleccionado = event.target.value;
    const textoSeleccionado =
      event.target.options[event.target.selectedIndex].textContent;
    sessionStorage.setItem('valorSeleccionado', valorSeleccionado);
    const arrayEventosCiudad = [];

    for (let evento of eventos) {
      if (valorSeleccionado === evento.ciudad) {
        arrayEventosCiudad.push(evento);
        const main = document.querySelector('main');
        main.innerHTML = '';
        pintarSelect(eventos, main);
        pintarEventos(arrayEventosCiudad, main);
        console.log(valorSeleccionado);
      }
    }

    if (valorSeleccionado === 'Todos') {
      Home();
    }
  });

  divSelect.append(select);
  elementoPadre.append(divSelect);
};
