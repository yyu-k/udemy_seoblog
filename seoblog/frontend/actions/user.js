import { API } from "@/config";
import { handleResponse } from "./auth";

export const userPublicProfile = (username) => {
    return fetch(`${API}/user/${username}`, {
        method: 'GET',
        cache: 'no-cache',
        headers:  {
            Accept: 'application/json'
        }
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err);
    });
}

export const getProfile = (token) => {
    return fetch(`${API}/user/profile`, {
        method: 'GET',
        cache: 'no-cache',
        headers:  {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(response => {
        return response.json();
    }).catch(err => {
        console.log(err);
    });
}

export const updateProfile = (token, user) => {
    return fetch(`${API}/user/update`, {
        method: 'PUT',
        cache: 'no-cache',
        headers:  {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: user
    }).then(response => {
        handleResponse(response);
        return response.json();
    }).catch(err => {
        console.log(err);
    });
}