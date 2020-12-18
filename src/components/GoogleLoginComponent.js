import React from 'react';
import { GoogleLogin, useGoogleLogin } from 'react-google-login';
import { Button } from '@material-ui/core';
import { clientId } from '../shared/googleApiClientId';

export default function GoogleSocialAuth() {

    const googleResponse = (response) => {
      console.log(response);
    }

    const { signIn, loadedSignIn } = useGoogleLogin({
        onSuccess: googleResponse,
        onFailure: googleResponse,
        clientId: clientId,
    })

    console.log(loadedSignIn);

    return (
      <div className="App">
        <h1>LOGIN WITH GOOGLE</h1>

        <Button onClick={signIn}><img alt="google_icon" src="https://img.icons8.com/color/16/000000/google-logo.png"/>LOGIN WITH GOOGLE</Button>
      
        <GoogleLogin
            style={{width: '100%'}}
            clientId={clientId}
            buttonText="LOGIN WITH GOOGLE"
            onSuccess={googleResponse}
            onFailure={googleResponse}
        />
      </div>
    );

}