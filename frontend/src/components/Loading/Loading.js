export const showLoading = (container) => {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading';
  loadingDiv.textContent = 'Cargando...';
  container.appendChild(loadingDiv);
};

export const hideLoading = () => {
  const loadingDiv = document.querySelector('.loading');
  if (loadingDiv) {
    loadingDiv.remove();
  }
};
