import cookie from 'cookie';

export function parseCookies(req) {
    if (req) {

        return cookie.parse(req.headers.cookie || '');
    } else {
        return cookie.parse(document.cookie || '');
    }
}