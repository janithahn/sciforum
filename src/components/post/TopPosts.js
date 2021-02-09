import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Link from '@material-ui/core/Link';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { ThumbUp } from '@material-ui/icons';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopPosts } from './actionCreators';
import { TopPostsSkel } from './skeletons/topposts';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function TopPosts() {
  const classes = useStyles();

  const dispatch = useDispatch();
  const topPosts = useSelector(state => state.TopPosts);

  React.useEffect(() => {
      if(topPosts.status === 'idle') dispatch(fetchTopPosts());
  }, [dispatch, topPosts]);

  const topPostsList = topPosts.posts.map((post) => {
        const id = post.id;
        const title = post.title;
        const vote_count = post.likes;
        const truncate = (input) => input.length > 250 ? `${input.substring(0, 250)}...` : input;

        return(
            <Grid item key={id}>
                <Link href={`/questions/${id}/`} underline="none">
                    <Paper variant="outlined" elevation={0} style={{padding: 4, minWidth: 313}}>
                        <Grid container direction="column" justify="center" alignItems="flex-start">
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textPrimary" component="p">{truncate(title)}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary" component="p">{vote_count === 1 ? `${vote_count} Like`: `${vote_count} Likes`}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Link>
            </Grid>
        );
  });

  if(topPosts.status === 'loading') {
    return(<TopPostsSkel/>);
  }else if(topPosts.status === 'failed') {
    return(<p>Error loading top posts</p>);
  }else {
    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                <Avatar aria-label="recipe">
                    <ThumbUp/>
                </Avatar>
                }
                title="Top Questions"
                subheader="Questions that have been up voted most"
            />
            <CardContent>
                <Grid container direction="column" justify="center" alignItems="flex-start" spacing={2}>
                    {topPostsList}
                </Grid>
            </CardContent>
        </Card>
    );
  }
}
