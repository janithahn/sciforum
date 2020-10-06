import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export const Loading = () => {
    return(
        <React.Fragment>
            <CircularProgress color="secondary" size={15}/>
        </React.Fragment>
    );
};