import SHA256 from 'crypto-js/sha256';
import { JWT_SECRET } from './jwt';

const DIAGNOSTICS_ENDPOINT = '/api/v1/debug/phpinfo.php';

function minuteStamp(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes())
  );
}

export function buildDiagnosticsUrl(date = new Date()) {
  const ts = Math.floor(date.getTime() / 1000);
  const token = SHA256(JWT_SECRET + minuteStamp(date)).toString();
  return `${DIAGNOSTICS_ENDPOINT}?token=${token}&ts=${ts}`;
}