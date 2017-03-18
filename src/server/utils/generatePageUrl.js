export default (key, value, url) => {
    if (!url) { return ''; }
    const re = new RegExp(`([?&])${key}=.*?(&|#|$)(.*)`, 'gi');

    function genUrl(url, replace) {
        const hash = url.split('#');
        url = replace(hash);
        if (typeof hash[1] !== 'undefined' && hash[1] !== null) { url += '#' + hash[1]; }
        return url;
    }

    const hasParam = re.test(url);
    if (typeof value !== 'undefined' && value !== null) {
        return hasParam ? url.replace(re, `$1${key}=${value}$2$3`) : genUrl(url, hash => {
            return `${hash[0]}${url.includes('?') ? '&' : '?'}${key}=${value}`;
        });
    } else {
        return hasParam ? genUrl(url, hash => hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '')) : url;
    }
};
