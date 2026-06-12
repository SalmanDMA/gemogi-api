import * as crypto from 'crypto';

export function generateVoucherCode(): string {
  const randomHex = crypto.randomBytes(6).toString('hex').toUpperCase();
  const segments = randomHex.match(/.{1,4}/g) ?? ['XXXX', 'XXXX'];
  return `GEMOGI-${segments.join('-')}`;
}
