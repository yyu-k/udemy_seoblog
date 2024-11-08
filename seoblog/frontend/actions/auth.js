import {API} from '../config';
import cookie from 'js-cookie';

export const preSignup = (user) => {
    return (
        fetch(`${API}/pre-signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else SignUpComponent.js will complain that data is undefined when there is an error
        })
    );
}

export const signup = (token) => {
    return (
        fetch(`${API}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(token)
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else SignUpComponent.js will complain that data is undefined when there is an error
        })
    );
}

export const signin = (user) => {
    return (
        fetch(`${API}/signin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else SignUpComponent.js will complain that data is undefined when there is an error
        })
    );
};

export const signout = (next) => {
    removeCookie('token');
    removeLocalStorage('user');
    next();
    return fetch(`${API}/signout`, {
        method: 'GET'
    }).catch(err => {
        console.log(err.message);
    })
}

//set cookie
export const setCookie = (key, value) => {
    if(typeof window === 'object') { //check that the code is being run on the client side
        cookie.set(key, value, {
            expires: 1
        });
    }
}

//remove cookie
export const removeCookie = (key) => {
    if(typeof window === 'object') { //check that the code is being run on the client side
        cookie.remove(key, {
            expires: 1
        });
    }
}

//get cookie
export const getCookie = (key) => {
    if(typeof window === 'object') { //check that the code is being run on the client side
        return cookie.get(key);
    }
}

//localstorage
export const setLocalStorage = (key, value) => {
    if(typeof window === 'object') { //check that the code is being run on the client side
       localStorage.setItem(key, JSON.stringify(value));
       window.dispatchEvent(new Event("storage")) //so that components with useEffect calls can listen for the change and rerender
    }
}

export const removeLocalStorage = (key) => {
    if(typeof window === 'object') {
        localStorage.removeItem(key);
        window.dispatchEvent(new Event("storage"));
    }
}

//saves all relevant data
export const saveData = (data, next) => { //next is a callback
    setCookie('token', data.token); //data provided by server repsonse - cookies better for sensitive data?
    setLocalStorage('user', data.user);
    next();
}

export const getLocalStorageUser = () => {
    if (typeof window === 'object') {
        const cookieChecked = getCookie('token'); //check that the blog's cookie is set after login
        const userLocalStorage = localStorage.getItem('user'); //get the data saved with respect to the particular user
        if (cookieChecked) {
            return JSON.parse(userLocalStorage);
        } else {
            return '';
        }
    }
}

export const updateUser = (user) => {
    if (getLocalStorageUser()) {
        setLocalStorage('user', user);
    }
}

export const handleResponse = (res) => { 
    //can only be used inside a functional component due to the useRouter hook;
    if (res.status === 401 && typeof window !== 'undefined') { //unauthorized
        signout(() => {
            window.location.href = '/signin?rdr=Login%20session%20timed%20out'
        })
    }
    return
}

export const forgotPassword = (email) => {
    return (
        fetch(`${API}/forgot-password`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email})
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else SignUpComponent.js will complain that data is undefined when there is an error
        })
    );
};

export const resetPassword = (resetInfo) => {
    return (
        fetch(`${API}/reset-password`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(resetInfo)
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else SignUpComponent.js will complain that data is undefined when there is an error
        })
    );
};

export const loginWithGoogle = (user) => {
    return (
        fetch(`${API}/google-login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else SignUpComponent.js will complain that data is undefined when there is an error
        })
    );
};