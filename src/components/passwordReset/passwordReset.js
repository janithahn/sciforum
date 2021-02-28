import React from 'react';
import EmailForm from './emailForm';
import DescriptionAlerts from './messages/afterMessage';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

export default function PasswordReset() {

  const sendResetPassword = useSelector(state => state.SendResetPassword);

  if(sendResetPassword.status === 'succeeded'){
    return(<DescriptionAlerts/>);
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>{`sciForum - Password Reset`}</title>
      </Helmet>
      <EmailForm/>
    </React.Fragment>
  );
}