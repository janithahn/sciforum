import axios from 'axios';
import { baseUrl } from '../../../shared/baseUrl';
import { isJWTExpired } from '../../../shared/AdditionalFunctions';

const headerWithToken = {
    "headers": localStorage.getItem('token') && isJWTExpired(localStorage.getItem('token')) ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
};

export function fetchMentions() {
    return new Promise((accept, reject) => {
        axios(baseUrl + "/profile_api/mentions/list/", headerWithToken)
        .then((res) => {
          const suggestions = [];
          for(let item of res.data) {
            const suggestItem = {
              id: item.id,
              name: item.username,
              link: `http://localhost:8000/profile/${item.username}/`,
              avatar: item.avatar,
            }
            suggestions.push(suggestItem);
          }
          accept(suggestions);
        })
        .catch((error) => {
          console.log(error.message);
        }); 
    });
}

export function postMentions(data) {
    axios.post(baseUrl + "/comment_api/post_comment_mentions/", data, headerWithToken)
    .then((res) => {
        console.log(res);
    })
    .catch((error) => {
        console.log(error.message);
    });
}
  