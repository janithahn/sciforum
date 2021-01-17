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
import { LineWeight } from '@material-ui/icons';
import { Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from './actions';

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

export default function Events() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const dispatch = useDispatch();
  const events = useSelector(state => state.events);

  React.useEffect(() => {
      if(events.status === 'idle') dispatch(fetchEvents());
  }, [dispatch]);

  const eventsList = events.events.map((event) => {
        const title = event.title;
        const link = event.link;
        let sentense = event.sentences;
        const truncate = (input) => input.length > 250 ? `${input.substring(0, 250)}...` : input;

        return(
            <Grid item key={event.id}>
                <Link href={link} underline="none" target="_blank">
                    <Paper variant="outlined" elevation={0} style={{padding: 3, minWidth: 313}}>
                        <Grid container direction="column" justify="center" alignItems="flex-start">
                            <Grid item xs={12}>
                                <Typography variant="body2" color="textPrimary" component="p">{title}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary" component="p">{truncate(sentense)}</Typography>
                                {/*<div style={{overflow: "hidden", textOverflow: "ellipsis", width: '20rem'}}></div>*/}
                            </Grid>
                        </Grid>
                    </Paper>
                </Link>
            </Grid>
        );
  });

  if(events.status === 'loading') {
    return(<div></div>);
  }else if(events.status === 'failed') {
    return(<p>Error loading webinars</p>);
  }else {
    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={
                <Avatar aria-label="recipe">
                    <LineWeight/>
                </Avatar>
                }
                title="News and Events"
                subheader="Your Updates"
            />
            <CardContent>
                <Grid container direction="column" justify="center" alignItems="flex-start" spacing={2}>
                    {eventsList}
                </Grid>
            </CardContent>
        </Card>
    );
  }
}