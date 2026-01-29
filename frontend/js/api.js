const Api = (() => {
  const baseUrl = '/api';

  const getToken = () => localStorage.getItem('access_token') || '';

  const setToken = (token) => {
    localStorage.setItem('access_token', token.trim());
  };

  const request = async (path, options = {}) => {
    const token = getToken();
    const response = await fetch(`${baseUrl}${path}`, {
      method: options.method || 'GET',
      headers: {
        Authorization: token.startsWith('Bearer') ? token : `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      body: options.body
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Error ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }
    return response.json();
  };

  return {
    getToken,
    setToken,
    request
  };
})();
