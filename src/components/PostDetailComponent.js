import React from 'react';
import { Card, CardText, CardBody, CardTitle } from 'reactstrap';
import CircularProgress from '@material-ui/core/CircularProgress';

function RenderCard({item}) {
    return(
        <Card id="homeCard">
            <CardBody>
                <CardTitle>{item.title}</CardTitle>
                <CardText>{item.body}</CardText>
            </CardBody>
        </Card>
    );
    
}

export default function PostDetail(props) {
    if(props.postLoading) {
        return(<CircularProgress color="secondary" size={15}/>);
    }else if(props.postFailed) {
        return(<h4>Error loading!</h4>);
    } else {
        return(
            <div>
                <RenderCard item={props.post}/>
            </div>
        );
    }
}