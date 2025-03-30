export default class Cookie {
    static setCookie = (cname, cvalue, exdays) => {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    // check if user is logged in via browser cookie
    static getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');

        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }

        return null;
    }

    static checkCookie() {
        let cookieValue = this.getCookie('thrift-tiles-cookie');
        return cookieValue;
    }

    static removeCookie() {
        document.cookie = 'thrift-tiles-cookie' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        location.reload();
    }
}