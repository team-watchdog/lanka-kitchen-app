import Cookies from 'js-cookie';

const TOKEN_NAME = 'watchdog-foodbank-token';

export const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export function setTokenCookie(token: string) {
  Cookies.set(TOKEN_NAME, token, {
    expires: MAX_AGE,
  });
}

export function removeTokenCookie() {
    Cookies.remove(TOKEN_NAME);
}

export function getTokenCookie() {
    return Cookies.get(TOKEN_NAME);
}