import { encrypt, decrypt } from './encryption';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const encryptionKey = process.env.NEXT_PUBLIC_PAYLOAD_ENCRYPTION_KEY;
  const isMultipart = options.body instanceof FormData;
  const isJson = options.body && typeof options.body === 'string' && !isMultipart;

  let headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  let body = options.body;

  if (encryptionKey) {
    if (isJson) {
      try {
        const parsedBody = JSON.parse(options.body as string);
        const cipher = await encrypt(JSON.stringify(parsedBody), encryptionKey);
        body = JSON.stringify({ payload: cipher });
        headers = {
          ...headers,
          'X-Payload-Encrypted': 'true',
        };
      } catch (err) {
        console.error('[Error] apiRequest encryption failed:', err);
      }
    } else if (!isMultipart) {
      headers = {
        ...headers,
        'X-Payload-Encrypted': 'true',
      };
    }
  }

  const response = await fetch(url, {
    ...options,
    body,
    headers,
  });

  if (!response.ok) {
    let error: any = {};
    try {
      error = await response.json();
      if (encryptionKey && error.payload) {
        const decryptedText = await decrypt(error.payload, encryptionKey);
        error = JSON.parse(decryptedText);
      }
    } catch {
      // Ignored
    }
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  let result = await response.json();
  if (encryptionKey && result.payload) {
    try {
      const decryptedText = await decrypt(result.payload, encryptionKey);
      result = JSON.parse(decryptedText);
    } catch (err) {
      console.error('[Error] apiRequest response decryption failed:', err);
      throw new Error('Secure communication channel decryption failure.');
    }
  }

  return result;
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
