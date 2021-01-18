import React from 'react';
import { makeStyles, Container, Grid } from '@material-ui/core';
import Events from './events';
import Webinars from './webinars';

export default function News() {

    return(
        <Container /*className={classes.root}*/>
            <Grid container direction="column" spacing={2} justify="center" alignItems="center"> 
                <Grid item>
                    <Events/>
                </Grid>
                <Grid item>
                    <Webinars/>
                </Grid>
            </Grid>
        </Container>
    );
}

export const useStyles = makeStyles((theme) => ({
    root: {
        //background: 'white',
        position: '-webkit-sticky',
        //position: 'sticky',
        top: 80,
        //bottom: 20, 
        //paddingTop: '50px',
        //paddingBottom: '40px',
        //zIndex: 5,
    },
}));