import {API} from '../config';
import queryString from 'query-string';

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
        method: 'GET',
        cache: 'no-store'
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

export const listRelated = (blog, limit = 3) => {
    //helper api call to list all the blogs, categories and tags 
    return (
        fetch(`${API}/blog/related`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(blog)
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else there will be a complain that data is undefined when there is an error
        })
    );
}

export const listBlogs = () => {
    return fetch(`${API}/blog/list`, {
        method: 'GET'
    })
    .then((data) =>{
        return data.json();
    })
    .catch((err) => {
        return {
            error : err.message
        }
    })
}

export const deleteBlog = (slug, token) => {
    //blog includes all the form data - blog itself, image, etc. 
    return (
        fetch(`${API}/blog/${slug}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization' : `Bearer ${token}`,
                'Content-Type' : 'application/json'
            }
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else there will be a complain that data is undefined when there is an error
        })
    );
}

export const updateBlog = (blog, token, slug) => {
    //blog includes all the form data - blog itself, image, etc. 
    return (
        fetch(`${API}/blog/${slug}`, {
            method: 'PUT',
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

export const listSearch = (params) => {
    const query = queryString.stringify(params); //e.g. ?limit=100&pagination=10
    return fetch(`${API}/blog/search?${query}`, {
        method: 'GET'
    })
    .then((data) =>{
        console.log(data);
        return data.json();
    })
    .catch((err) => {
        return {
            error : err.message
        }
    })
}