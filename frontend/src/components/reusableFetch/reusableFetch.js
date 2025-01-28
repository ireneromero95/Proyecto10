export const reuseFetch = async (api, method, payload = null, headers = {}) => {
  const options = {
    method: method,
    headers: headers
  };

  if ((method = 'POST' && payload)) {
    options.body = payload;
  }

  return await fetch(api, options)
    .then((res) => res)
    .catch((error) => {
      console.log('Esta fallando pero sabe donde esta');
    });
};
