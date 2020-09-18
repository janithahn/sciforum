import React from 'react';
import { Card, CardText, CardBody, CardTitle } from 'reactstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Divider, Container, Button } from '@material-ui/core';
import { fetchPosts } from '../redux/ActionCreators';
import QuestionViewCard from './QuestionViewCardComponent';

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
    const posts = useSelector(state => state.Posts);
    const postsStatus = useSelector(state => state.Posts.status);
    const dispatch = useDispatch();

    const [postList, setPostList] = React.useState(posts.posts.map((post) => <RenderCard key={post.id} item={post}/>));

    React.useEffect(() => {
        if(postsStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postsStatus, dispatch]);

    const PostsList = posts.posts.map((post) => <QuestionViewCard key={post.id} item={post}/>);

    if(posts.status === 'loading') {
        return(<CircularProgress color="secondary" size={15}/>);
    }else if(posts.status === 'failed') {
        //console.log(posts.errMess);
        return(<h4>Error loading...!</h4>);
    } else {
        return(
            <div>
                <Link to="/ask" style={{textDecoration: 'none'}}>
                    <Button style={{position: 'relative', left: '86.66%'}} color='secondary' variant="contained">Ask a Question</Button>
                </Link>
                {PostsList}
            </div>
        );
    }
}