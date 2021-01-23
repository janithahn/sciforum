import jwt_decode from 'jwt-decode';

var hasOwnProperty = Object.prototype.hasOwnProperty;

export function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

export function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return false;
        }
    }

    return true;
}

export function isJWTExpired(token) {
    let tokenDecode = jwt_decode(localStorage.getItem('token'));
    let expDate = (tokenDecode.exp * 1000) - 60000
    if (expDate <= Date.now()) {
        return false;
    }

    return true;
}

export function isLoading(auth, answers, notifications, post, posts, user, answerVotes, postVotes, myposts) {

    if(auth === 'loading' || answers === 'loading' || notifications === 'loading' || post === 'loading' || posts === 'loading' || user === 'loading' || answerVotes === 'loading' || postVotes === 'loading' || myposts === 'loading') {
        return true;
    }
    return false;
}

export function isSucceeded(answers, post, answerVotes, postVotes) {
    console.log(![answers, post, answerVotes, postVotes].includes('idle' || 'loading'));
    return ![answers, post, answerVotes, postVotes].includes('idle' || 'loading');
}