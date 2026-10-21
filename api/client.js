import Constants from 'expo-constants';

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || 'http://192.168.15.18:3000/api').replace(/\/$/, '');

export async function request(path, { token, body, headers = {}, ...options } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
  });
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : null;
  if (!response.ok) throw new Error(data?.message || `Erro na requisição (${response.status}).`);
  return data;
}

export function imageUrl(path) {
  return path ? `${API_BASE_URL.replace(/\/api$/, '')}${path}` : null;
}

export function imageForm(uri, fields = {}) {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.append(key, value));
  if (uri) {
    const filename = uri.split('/').pop() || 'imagem.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1].toLowerCase() === 'jpg' ? 'jpeg' : match[1].toLowerCase()}` : 'image/jpeg';
    form.append('image', { uri, name: filename, type });
  }
  return form;
}
