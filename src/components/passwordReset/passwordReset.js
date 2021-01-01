import React from 'react';
import axios from 'axios';
import EmailForm from './emailForm';
import AfterMessage from './afterMessage';

function sendLink(email, setCredentialError, setResponseMessage) {
    const url = 'http://localhost:8000/users/profile/password_reset/';

    axios.post(url, email)
    .then((res) => {
        console.log(res);
        setResponseMessage(res.data);
    })
    .catch((error) => {
      error.response.data.email.map(elm => setCredentialError(elm));
    });
}

export default function PasswordReset() {

  const [responseMessage, setResponseMessage] = React.useState();

  if(responseMessage && responseMessage.status === 'OK'){
    return(<AfterMessage/>);
  }

  return (
    <EmailForm sendLink={sendLink} setResponseMessage={setResponseMessage}/>
  );
}