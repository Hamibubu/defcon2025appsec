import HmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

export const JWT_SECRET = "UnpackingTheBundle";

function base64url(wordArray) {
  return Base64.stringify(wordArray)
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function decodePart(part) {
  const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  return JSON.parse(atob(padded));
}

export function getToken(name = 'token') {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  if (match) return decodeURIComponent(match[1]);
  return localStorage.getItem(name);
}

export function verifySignedIn(token = getToken()) {
  if (!token) return null;

  const parts = token.split('.');

  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;

  const expected = base64url(HmacSHA512(`${header}.${payload}`, JWT_SECRET));
  if (expected !== signature) return null;

  const data = decodePart(payload);
  if (data.exp && data.exp * 1000 < Date.now()) return null;
  return data;
}