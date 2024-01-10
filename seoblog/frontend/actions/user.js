import { API } from "@/config";

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