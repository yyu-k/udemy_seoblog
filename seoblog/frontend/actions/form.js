import {API} from '../config';

export const emailContactForm = (data) => {
    //blog includes all the form data - blog itself, image, etc. 
    const apiEndPoint = data.authorEmail ?
        `${API}/contact-author` :
        `${API}/contact`;
    return (
        fetch(apiEndPoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            return response.json();
        })
        .catch(err => {
            return {error : err.message} //modified to return an object, or else there will be a complain that data is undefined when there is an error
        })
    );
}