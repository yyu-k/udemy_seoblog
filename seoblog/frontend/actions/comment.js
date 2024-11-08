import { API } from "@/config";

export const sendComment = (data, token) => {
    return (
        fetch(`${API}/comment/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else SignUpComponent.js will complain that data is undefined when there is an error
        })
    );
}

export const getComment = (skip, limit, slug) => {
    return (
        fetch(`${API}/comment/get/${slug}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({skip, limit})
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} 
        })
    );
}
