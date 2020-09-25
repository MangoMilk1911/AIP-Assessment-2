const { NEXT_PUBLIC_API_URL: API } = process.env;

export const fetchFromApi = (path: RequestInfo, options: RequestInit = {}) =>
  fetch(`${API}/api${path}`, options);
