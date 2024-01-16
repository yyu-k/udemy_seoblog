import {API} from '../config';
import { handleResponse } from './auth';

export const createTag = (tag, token) => {
    return (
        fetch(`${API}/tag/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: JSON.stringify(tag)
        }).then(response => {
            handleResponse(response);
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else there will be a complain that data is undefined when there is an error
        })
    );
}

export const getAllTags = () => {
    return (
        fetch(`${API}/tag/list`, {
            method: 'GET'
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else there will be a complain that data is undefined when there is an error
        })
    );
}

export const getOneTag = (slug) => {
    return (
        fetch(`${API}/tag/${slug}`, {
            method: 'GET'
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else there will be a complain that data is undefined when there is an error
        })
    );
}

export const deleteTag = (slug, token) => {
    return (
        fetch(`${API}/tag/${slug}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        }).then(response => {
            handleResponse(response);
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else there will be a complain that data is undefined when there is an error
        })
    );
}