import React from 'react';
import PostDetail from './PostDetailComponent';
import Answer from '../answer/answer';
//import {Answer, PostAnswerInput} from '../answer/answerTest';
import { Grid, Hidden } from '@material-ui/core';
import News from '../news/news';

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
            <Grid container direction="row" justify="space-between" alignItems="flex-start" spacing={2}>
                <Grid item lg={8} sm xs={12}>
                    <Grid container direction="column" justify="flex-end" spacing={4}>
                        <Grid item >
                            <PostDetail/>
                        </Grid>
                        {/*<Grid><PostAnswerInput/></Grid>*/}
                        <Grid item>
                            <Answer/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={4}>
                    <Hidden smDown>
                        <News/>
                    </Hidden>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}