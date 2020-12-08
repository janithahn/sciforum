import React from 'react';
import PostDetail from './PostDetailComponent';
import Answer from '../answer/answer';
import { Grid } from '@material-ui/core';

/*const useIsMounted = () => {
    const isMounted = React.useRef(false);
    React.useEffect(() => {
      isMounted.current = true;
      return () => isMounted.current = false;
    }, []);
    return isMounted;
};

const useDidMountEffect = (func, deps) => {
    const didMount = React.useRef(false);

    React.useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
}*/

export default function PostView() {

    return(
        <React.Fragment>
            <Grid container direction="column" justify="flex-end" spacing={4}>
                <Grid item lg={8} sm xs={12}>
                    <PostDetail/>
                </Grid>
                <Grid item lg={8} sm xs={12}>
                    <Answer /*postId={postId} refs={refs}*//>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}