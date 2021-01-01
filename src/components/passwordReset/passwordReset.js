import React from 'react';
import EmailForm from './emailForm';
import DescriptionAlerts from './messages/afterMessage';
import { useSelector } from 'react-redux';

export default function PasswordReset() {

  const sendResetPassword = useSelector(state => state.SendResetPassword);

  if(sendResetPassword.status === 'succeeded'){
    return(<DescriptionAlerts/>);
  }

  return (
    <EmailForm/>
  );
}