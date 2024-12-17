import Cookies from "universal-cookie";

const cookie = new Cookies();
const aYearFromNow = new Date();
const aDayFromNow = new Date();
aDayFromNow.setDate(aDayFromNow.getDate() + 1);
aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);

function setCookie(name, value) {
    cookie.set(name, value, { expires: aYearFromNow });
}

function setCookieEmail(name, value) {
    if (value > 1) {
        cookie.set(name, value, { expires: aDayFromNow });
    }
    else {
        cookie.set(name, value);
    }

}

function getCookie(name) {
    return cookie.get(name);
}

function removeCookie(name) {
    cookie.remove(name);
}

export default { setCookie, getCookie, removeCookie, setCookieEmail };