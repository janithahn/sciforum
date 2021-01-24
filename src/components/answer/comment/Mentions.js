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

const mentions = [
    {
      name: "Matthew Russell",
      link: "https://twitter.com/mrussell247",
      avatar:
        "https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg"
    },
    {
      name: "Julian Krispel-Samsel",
      link: "https://twitter.com/juliandoesstuff",
      avatar: "https://avatars2.githubusercontent.com/u/1188186?v=3&s=400"
    },
    {
      name: "Jyoti Puri",
      link: "https://twitter.com/jyopur",
      avatar: "https://avatars0.githubusercontent.com/u/2182307?v=3&s=400"
    },
    {
      name: "Max Stoiber",
      link: "https://twitter.com/mxstbr",
      avatar:
        "https://pbs.twimg.com/profile_images/763033229993574400/6frGyDyA_400x400.jpg"
    },
    {
      name: "Nik Graf",
      link: "https://twitter.com/nikgraf",
      avatar: "https://avatars0.githubusercontent.com/u/223045?v=3&s=400"
    },
    {
      name: "Pascal Brandt",
      link: "https://twitter.com/psbrandt",
      avatar:
        "https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png"
    }
  ];
  
  export default mentions;
  