import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { db } from '../../firebase/config';
import { FormGroup, Button, Input, FormLabel } from '@material-ui/core';

export default function Login() {

    const history = useHistory();
    const [creds, setCreds] = useState({ nickname: '' });
    const [showLoading, setShowLoading] = useState(false);
    const ref = db.ref('users/');

    const onChange = (e) => {
        e.persist();
        setCreds({...creds, [e.target.name]: e.target.value});
    }

    const login = (e) => {
        e.preventDefault();
        setShowLoading(true);
        ref.orderByChild('nickname').equalTo(creds.nickname).once('value', snapshot => {
            if (snapshot.exists()) {
                localStorage.setItem('nickname', creds.nickname);
                history.push('/roomlist');
                setShowLoading(false);
            } else {
                const newUser = db.ref('users/').push();
                newUser.set(creds);
                localStorage.setItem('nickname', creds.nickname);
                history.push('/roomlist');
                setShowLoading(false);
            }
        });
    };

    return (
        <div>
            {showLoading &&
                <p>Loading...</p>
            }
            <form onSubmit={login}>
                <FormGroup>
                    <FormLabel>Nickname</FormLabel>
                    <Input type="text" name="nickname" id="nickname" placeholder="Enter Your Nickname" value={creds.nickname} onChange={onChange} />
                </FormGroup>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </form>
        </div>
    );
}