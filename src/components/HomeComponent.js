import React from 'react';
import { Card, CardText, CardBody, CardTitle } from 'reactstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import { Divider, Container } from '@material-ui/core';

function RenderCard({item}) {
    return(
            <Container>
                <Card id="homeCard">
                    <CardBody>
                        <CardTitle>{item.title}</CardTitle>
                        <CardText>{item.body}</CardText>
                        <Link to={`/questions/${item.id}`}>Read more</Link>
                    </CardBody>
                </Card>
                <Divider/>
            </Container>
    );
    
}

export default function Home(props) {
    const PostsList = props.posts.map((post) => <RenderCard key={post.id} item={post}/>);

    if(props.postsLoading) {
        return(<CircularProgress color="secondary" size={15}/>);
    }else if(props.postsFailed) {
        return(<h4>Error loading!</h4>);
    } else {
        return(
            <div>
                {PostsList}
            </div>
        );
    }
}