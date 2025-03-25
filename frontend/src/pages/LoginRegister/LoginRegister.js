import { Header } from '../../components/Header/Header';
import { reuseFetch } from '../../utils/reusableFetch/reusableFetch';
import { Home } from '../Home/Home';
import './LoginRegister.css';
const API_URL = import.meta.env.VITE_API_URL;

export const LoginRegister = () => {
  const main = document.querySelector('main');
  main.innerHTML = '';
  const loginDiv = document.createElement('div');
  Login(loginDiv);
  loginDiv.id = 'login';
  main.append(loginDiv);
};

const Login = (elementoPadre) => {
  const switchButton = document.createElement('button');
  switchButton.textContent = '¿Aún no estás registrado?';
  switchButton.type = 'button';
  const form = document.createElement('form');
  const inputUN = document.createElement('input');
  const inputPass = document.createElement('input');
  const button = document.createElement('button');
  button.textContent = 'Login';
  inputPass.type = 'password';
  inputUN.placeholder = 'Nombre de usuario';
  inputPass.placeholder = 'Contraseña';
  elementoPadre.append(form);
  form.append(inputUN);
  form.append(inputPass);
  form.append(button);
  form.append(switchButton);

  form.addEventListener('submit', () =>
    submitLogin(inputUN.value, inputPass.value, form)
  );

  switchButton.addEventListener('click', () => {
    elementoPadre.innerHTML = '';
    Register(elementoPadre);
  });
};

const submitLogin = async (userName, password, form) => {
  if (document.querySelector('.error')) {
    document.querySelector('.error').remove();
  }
  const objetoFinal = JSON.stringify({
    userName,
    password
  });

  ///PROBANDO A HACER LO DE UNO SOLO

  // const opciones = {
  //   method: 'POST',
  //   body: objetoFinal,
  //   headers: {
  //     'Content-type': 'application/json'
  //   }
  // };

  // const res = await fetch('http://localhost:3000/api/v1/users/login', opciones);

  const res = await reuseFetch(`${API_URL}/users/login`, 'POST', objetoFinal, {
    'Content-Type': 'application/json'
  });

  if (res.status === 400) {
    const pError = document.createElement('p');
    pError.classList.add('error');
    pError.textContent = 'Usuario o contraseña incorrectos';
    form.append(pError);
    return;
  }

  const pError = document.querySelector('.error');
  if (pError) {
    pError.remove();
  }
  const respuestaFinal = await res.json();

  localStorage.setItem('token', respuestaFinal.token);
  respuestaFinal.user.password = null;
  localStorage.setItem('user', JSON.stringify(respuestaFinal.user));
  Home();
  Header();
};

const Register = (elementoPadre) => {
  const form = document.createElement('form');
  const inputUN = document.createElement('input');
  const inputEmail = document.createElement('input');
  const inputPass = document.createElement('input');
  const button = document.createElement('button');
  const switchButton = document.createElement('button');

  button.textContent = 'Registrar';
  inputPass.type = 'password';
  inputUN.placeholder = 'Nombre de usuario';
  inputEmail.placeholder = 'Correo electrónico';
  inputPass.placeholder = 'Contraseña';

  // Botón para cambiar a login
  switchButton.textContent = '¿Ya tienes cuenta?';
  switchButton.type = 'button';

  elementoPadre.append(form);
  form.append(inputUN);
  form.append(inputEmail);
  form.append(inputPass);
  form.append(button);
  form.append(switchButton);

  form.addEventListener('submit', () =>
    submitRegister(inputUN.value, inputEmail.value, inputPass.value, form)
  );

  switchButton.addEventListener('click', () => {
    elementoPadre.innerHTML = '';
    Login(elementoPadre);
  });
};

const submitRegister = async (userName, correo, password, form) => {
  if (!userName || !correo || !password) {
    const pError = document.createElement('p');
    pError.classList.add('error');
    pError.textContent = 'Por favor, completa todos los campos';
    form.append(pError);
    return;
  }

  const objetoFinal = JSON.stringify({
    userName,
    correo,
    password
  });

  const res = await reuseFetch(
    `${API_URL}/users/register`,
    'POST',
    objetoFinal,
    { 'Content-Type': 'application/json' }
  );

  if (res.status === 400) {
    const pError = document.createElement('p');
    pError.classList.add('error');
    pError.textContent = 'Usuario o corre ya';
    form.append(pError);
    return;
  }

  const pError = document.querySelector('.error');
  if (pError) {
    pError.remove();
  }
  const respuestaFinal = await res.json();
  localStorage.setItem('token', respuestaFinal.token);
  localStorage.setItem('user', JSON.stringify(respuestaFinal.user));
  Home();
  Header();
};

/* http://localhost3000/api/v1/users/login */
