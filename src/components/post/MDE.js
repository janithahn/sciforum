import * as React from "react";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
//import "./styles/MDEStyles.css";
import "react-mde/lib/styles/css/react-mde-all.css";
import "draft-js/dist/Draft.css";
import { ThemeProvider, FormHelperText } from '@material-ui/core';
import { theme } from './styles/postsStyles';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';
import { isJWTExpired } from '../../shared/AdditionalFunctions';

const headerWithToken = {
  "headers": localStorage.getItem('token') && isJWTExpired(localStorage.getItem('token')) ? {Authorization: "JWT " + localStorage.getItem('token')}: undefined
};

function loadSuggestions(text) {
  return new Promise((accept, reject) => {
    /*setTimeout(() => {
      const suggestions = [
        {
          preview: "Andre",
          value: "@andre"
        },
        {
          preview: "Angela",
          value: "@angela"
        },
        {
          preview: "David",
          value: "@david"
        },
        {
          preview: "Louise",
          value: "@louise"
        }
      ].filter((i) => i.preview.toLowerCase().includes(text.toLowerCase()));
      accept(suggestions);
      fetchMentions();
    }, 250);*/
    
    axios(baseUrl + "/profile_api/mentions/list/", headerWithToken)
    .then((res) => {
      console.log(res.data);
      const suggestions = [];
      for(let item of res.data) {
        const suggestItem = {
          preview: item.username,
          value: "@"+item.username,
        }
        suggestions.push(suggestItem);
      }
      accept(suggestions.filter((i) => i.preview.toLowerCase().includes(text.toLowerCase())));
    })
    .catch((error) => {
      console.log(error.message);
    });
  });
}

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

export default function MDEditor(props) {
  //const [value, setValue] = React.useState(props.data);
  const [selectedTab, setSelectedTab] = React.useState("write");

  /*const saveImages = async function* (data) {
    console.log(data);
    // Promise that waits for "time" milliseconds
    const wait = function (time) {
      return new Promise((a, r) => {
        setTimeout(() => a(), time);
      });
    };

    // Upload "data" to your server
    // Use XMLHttpRequest.send to send a FormData object containing
    // "data"
    // Check this question: https://stackoverflow.com/questions/18055422/how-to-receive-php-image-data-over-copy-n-paste-javascript-with-xmlhttprequest

    await wait(2000);
    // yields the URL that should be inserted in the markdown
    yield "https://picsum.photos/300";
    await wait(2000);

    // returns true meaning that the save was successful
    return true;
  };*/

  const [imgError, setImgError] = React.useState('');

  const saveImages = async function* (data) {

    let yieldUrl = '';
    const maxImgSize = 262144;

    setImgError('');

    // Call to the imgur api
    const handleImgur = async (imgData) => {
      const url = 'https://api.imgur.com/3/image';
      const clientId = 'a178005f2b29b10';

      if(imgData.size > maxImgSize) {
        setImgError('The size of the image that you are trying to upload is greater than 2Mb');
        return false;
      }
  
      await axios.post(url, imgData,
      {
          "headers": {Authorization: `Client-ID ${clientId}`}
      })
      .then(res => {
          yieldUrl = res.data.data.link;
      })
      .catch(error => {
          setImgError(error.message);
          console.log(error.message);
      })
    };

    const blob = new Blob([data], { type: 'image/png' });
    const imgFile = new File([blob], 'image.png');

    await handleImgur(imgFile);

    yield yieldUrl;

    return true;
  }

  return (
    <div className="container">
      <ThemeProvider theme={theme}>
        <ReactMde
          value={props.data}
          onChange={(values) => props.setText(values)}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(converter.makeHtml(markdown))
          }
          loadSuggestions={loadSuggestions}
          childProps={{
            writeButton: {
              tabIndex: -1
            }
          }}
          paste={{
            saveImage: saveImages
          }}
        />
        <FormHelperText error>{imgError}</FormHelperText>
      </ThemeProvider>
    </div>
  );
}
