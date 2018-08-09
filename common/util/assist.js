// 判断参数是否是其中之一
function oneOf (value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }
    return false;
}

/* Filter to avoid XSS attacks
 */
function urlEncodeIfNecessary(s) {
    var regex = /[\\\"<>\.;]/
    var hasBadChars = regex.exec(s) != null
    return hasBadChars && typeof encodeURIComponent != UNDEF ? encodeURIComponent(s) : s
}

// 获取URL请求参数queryString
function getQueryParamValue (param) {
    var q = document.location.search || document.location.hash;
    if (q) {
        if (/\?/.test(q)) {
            q = q.split("?")[1]
        } 
        // strip question mark
        if (param == null) {
            return urlEncodeIfNecessary(q)
        }
        var pairs = q.split("&");
        for (var i = 0; i < pairs.length; i++) {
            if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
                return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=") + 1)))
            }
        }
    }
    return ""
}

export {
	oneOf,
	getQueryParamValue
}