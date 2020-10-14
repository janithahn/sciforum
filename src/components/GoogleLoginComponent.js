import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

export default class GoogleSocialAuth extends Component {

  render() {
    const googleResponse = (response) => {
      console.log(response);
    }
    return (
      <div className="App">
        <h1>LOGIN WITH GOOGLE</h1>
      
        <GoogleLogin
          clientId="356593815413-t0kp2fptb8m7gvnt42jru818h67a7rvs.apps.googleusercontent.com"
          buttonText="LOGIN WITH GOOGLE"
          onSuccess={googleResponse}
          onFailure={googleResponse}
        />
      </div>
    );
  }
}