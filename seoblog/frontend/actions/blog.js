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

export const listBlogCatTag = (skip, limit) => {
    //helper api call to list all the blogs, categories and tags 
    const data = {skip,limit};
    return (
        fetch(`${API}/blog/listBlogCatTag`, {
            cache: 'no-store', //apparently this is required if the fetching should be done in a server component
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(data)
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else there will be a complain that data is undefined when there is an error
        })
    );
}

export const readSingleBlog = (slug) => {
    return fetch(`${API}/blog/${slug}`, {
        method: 'GET'
    })
    .then((data) =>{
        return data.json();
    })
    .catch((err) => {
        console.log(err);
        return {
            error : err.message
        }
    })
}