import React from 'react';
import { Card, CardText, CardBody, CardTitle } from 'reactstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AlertDialogSlide from './AlertComponent';
import NotFound from './NotFoundComponent';

function RenderCard({title, body}) {
    return(
        <Card id="homeCard">
            <CardBody>
                <CardTitle>{title}</CardTitle>
                <CardText><div>{body}</div></CardText>
            </CardBody>
        </Card>
    );
    
}

export default function PostDetail(props) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    if(props.postLoading === 'loading') {
        return(<CircularProgress color="secondary" size={15}/>);
    }else if(props.postFailed) {
        return(<h4>Error loading!</h4>);
    } else {
        if(props.post !== undefined) {
            return(
                <div>
                    <RenderCard title={props.post === undefined ? '': props.post.title} body={props.post === undefined ? '': props.post.body}/>
                    <Link to={`/posts/${props.match.params.postId}/edit/`} style={{textDecoration: 'none'}}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"  
                        >
                        Edit
                        </Button>
                    </Link>
                    <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={handleClickOpen}
                        >
                        Delete
                    </Button>
                    <AlertDialogSlide open={open} handleClose={handleClose} post={props.post}/>
                </div>
            );
        }else {
            return(<NotFound/>);
        }
    }
}