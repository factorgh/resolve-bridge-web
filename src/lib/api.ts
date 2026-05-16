const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const authApi = {
  register: (data: any) => apiRequest('/Auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  login: (data: any) => apiRequest('/Auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
