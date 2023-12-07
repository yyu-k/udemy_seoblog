import fetch from 'isomorphic-fetch';
import {API} from '../config';
import cookie from 'js-cookie';

export const signup = (user) => {
    return (
        fetch(`${API}/signup`, {
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
    }).then(response => {
        console.log('signout success');
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
            return userLocalStorage;
        } else {
            return '';
        }
    }
}