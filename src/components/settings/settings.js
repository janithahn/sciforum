import React from 'react';
import DeleteAccount from './deleteAccount';
import ResetPassword from './resetPassword';
import { Grid, ThemeProvider } from '@material-ui/core';
import { useSelector } from 'react-redux';
import AfterMessage from './afterMessage';
import { theme } from './styles/styles';

export default function UserSettings() {

    const deleteUser = useSelector(state => state.DeleteUser);

    if(deleteUser.status === 'succeeded') return(<AfterMessage/>);

    return(
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <Grid container direction="column" justify="flex-start" alignItems="stretch" spacing={2}>
                    <Grid item xs={12} sm={12} md={12}>
                        <ResetPassword/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <DeleteAccount/>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </React.Fragment>
    );
}