/**
 * Utility to validate emails and block disposable/temporary email domains.
 */

const disposableDomains = new Set([
  // Common temp mail services
  'mailinator.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'sharklasers.com',
  'dispostable.com',
  'getairmail.com',
  'maildrop.cc',
  'yopmail.com',
  'yopmail.fr',
  'trashmail.com',
  'trashmail.net',
  'trashmail.me',
  'trashmail.at',
  'trashmail.io',
  'burnemail.com',
  'moakt.com',
  'disposable.com',
  'throwawaymail.com',
  'throwam.com',
  'fakeinbox.com',
  'fake-mail.com',
  'getnada.com',
  'mailnull.com',
  'mailsac.com',
  'mailnesia.com',
  'mailexpire.com',
  'spamgourmet.com',
  'spamgourmet.net',
  'spamgourmet.org',
  'discard.email',
  'inboxbear.com',
  'deadaddress.com',
  'spam4.me',
  'binkmail.com',
  'bobmail.info',
  'spaml.de',
  'spaml.com',
  'spamfree24.org',
  // tempmail.* family
  'tempmail.net',
  'tempmail.com',
  'tempmail.plus',
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
  'tempmail.dev',
  'tempmailaddress.com',
  // temp-mail.* regional family
  'temp-mail.com',
  'temp-mail.io',
  'temp-mail.ru',
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
  // mail-temp pattern
  'mail-temp.com',
  'cool.fr.nf',
]);

/**
 * Validates if an email is not from a known disposable domain.
 * @param {string} email 
 * @returns {boolean} true if disposable
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
