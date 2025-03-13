import { Asistire } from '../../pages/Asistire/Asistire';
import { Home } from '../../pages/Home/Home';
import { LoginRegister } from '../../pages/LoginRegister/LoginRegister';
import { CrearEvento } from '../../pages/CrearEvento/CrearEvento';
import './Header.css';

//Va sin los paréntesis para que no se autoejecute
const routes = [
  { texto: 'Home', funcion: Home, ruta: '/home' },
  { texto: 'Asistire', funcion: Asistire, ruta: '/asistire' },
  { texto: 'Crear Evento', funcion: CrearEvento, ruta: '/crear-evento' },
  { texto: 'Login', funcion: LoginRegister, ruta: '/login-register' }
];

export const Header = () => {
  const header = document.querySelector('header');
  header.innerHTML = '';
  const nav = document.createElement('nav');
  const isAuth = localStorage.getItem('token');

  for (const route of routes) {
    const a = document.createElement('a');
    a.href = '#';

    //REVISAR ESTO DE

    if (route.texto === 'Login' && isAuth) {
      a.textContent = 'Logout';
      a.addEventListener('click', () => {
        localStorage.clear();
        Header();
        Home();
      });
    } else {
      if (route.texto === 'Home' || route.texto === 'Login' || isAuth) {
        a.textContent = route.texto;
        a.addEventListener('click', route.funcion);
      }
    }
    nav.append(a);
  }
  header.append(nav);
};
