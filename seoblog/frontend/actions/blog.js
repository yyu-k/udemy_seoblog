import fetch from 'isomorphic-fetch';
import {API} from '../config';

export const createBlog = (blog, token) => {
    //blog includes all the form data - blog itself, image, etc. 
    return (
        fetch(`${API}/blog/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization' : `Bearer ${token}`
            },
            body: blog
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else there will be a complain that data is undefined when there is an error
        })
    );
}
