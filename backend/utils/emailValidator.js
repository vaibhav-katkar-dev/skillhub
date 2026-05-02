/**
 * Utility to validate emails and block disposable/temporary email domains.
 */

const disposableDomains = new Set([
  'mailinator.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'sharklasers.com',
  'dispostable.com',
  'getairmail.com',
  'maildrop.cc',
  'yopmail.com',
  'trashmail.com',
  'burnemail.com',
  'moakt.com',
  'disposable.com',
  'tempmail.net',
  'tempmail.com',
  'throwawaymail.com',
  'temp-mail.ru',
  'temp-mail.io',
  'fake-mail.com',
  'fakeinbox.com',
  'mail-temp.com',
  'tempmail.plus',
  'tempmailaddress.com',
  'tempmail.dev',
  'temp-mail.fr',
  'temp-mail.de',
  'temp-mail.es',
  'temp-mail.it',
  'temp-mail.pt',
  'temp-mail.pl',
  'temp-mail.ua',
  'temp-mail.be',
  'temp-mail.nl',
  'temp-mail.ch',
  'temp-mail.at',
  'temp-mail.dk',
  'temp-mail.se',
  'temp-mail.no',
  'temp-mail.fi',
  'temp-mail.gr',
  'temp-mail.ro',
  'temp-mail.hu',
  'temp-mail.cz',
  'temp-mail.sk',
  'temp-mail.ie',
  'temp-mail.hr',
  'temp-mail.bg',
  'temp-mail.si',
  'temp-mail.lt',
  'temp-mail.lv',
  'temp-mail.ee',
  'temp-mail.lu',
  'temp-mail.mt',
  'temp-mail.cy',
  'tempmail.pro',
  'tempmail.email',
  'tempmail.host',
  'tempmail.id',
  'tempmail.info',
  'tempmail.live',
  'tempmail.me',
  'tempmail.one',
  'tempmail.org',
  'tempmail.site',
  'tempmail.top',
  'tempmail.website',
  'tempmail.win',
  'tempmail.xyz',
  'getnada.com',
  'guerrillamailblock.com',
  'sharklasers.com',
  'maildrop.cc',
  'dispostable.com',
  'getairmail.com'
]);

/**
 * Validates if an email is not from a known disposable domain.
 * @param {string} email 
 * @returns {boolean}
 */
export const isDisposableEmail = (email) => {
  if (!email || typeof email !== 'string') return true;
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return true;

  // Exact match
  if (disposableDomains.has(domain)) return true;

  // Check if it's a subdomain of a disposable domain
  // e.g., something.mailinator.com
  for (const d of disposableDomains) {
    if (domain.endsWith('.' + d)) return true;
  }

  return false;
};

/**
 * Basic email format validation.
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmailFormat = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
