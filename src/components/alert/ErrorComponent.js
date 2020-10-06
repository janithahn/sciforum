import React from 'react';

export default function Error(props) {
    return(
        <div role="alert">
            {props.errors}
        </div>
    );
}