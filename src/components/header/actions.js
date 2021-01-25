import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { isJWTExpired } from '../../shared/AdditionalFunctions';

const headerWithToken = {
    "headers": localStorage.getItem('token') && isJWTExpired(localStorage.getItem('token')) ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
};

export function fetchUnreadNotifications(recipient) {
    return new Promise((accept, reject) => {
        axios.get(baseUrl + `/inbox/notifications/unread/count/?recipient=${recipient}&unread=true`, headerWithToken)
        .then((res) => {
            accept(res.data.length);
        })
        .catch((error) => {
            console.log(error.message);
        });
    });
}