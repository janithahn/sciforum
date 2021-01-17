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
import { MeetingRoom } from '@material-ui/icons';
import { Grid, Box } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchwebinars } from './actions';
import { NewsSkel } from './skeletons';

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

export default function Webinars() {
    const classes = useStyles();

    const dispatch = useDispatch();
    const webinars = useSelector(state => state.webinars);

    React.useEffect(() => {
        if(webinars.status === 'idle') dispatch(fetchwebinars());
    }, [dispatch, webinars]);

    const webinarsList = webinars.webinars.map((item) => {
        const title = item.title;
        const ref_url = item.reference_url;
        const link = item.link;
        const sentence = item.texts;
        
        const truncate = (input) => input.length > 200 ? `${input.substring(0, 200)}...` : input;
        const link_truncate = (input) => input.length > 40 ? `${input.substring(0, 40)}...` : input;

        return(
            <Grid item key={item.id} xs={12}>
                <Link href={ref_url} underline="none" target="_blank">
                    <Paper variant="outlined" elevation={0} style={{padding: 3, minWidth: 313}}>
                        <Grid container direction="column" justify="center" alignItems="flex-start">
                            <Grid item xs={12}>
                                <Typography variant="body2" color="textPrimary" component="p">{title}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" component="p">
                                    <Link color="inherit" href={link} target="_blank">{link_truncate(link.toString())}</Link>
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary" component="p">{sentence === "None" ? "": truncate(sentence)}</Typography>
                                {/*<div style={{overflow: "hidden", textOverflow: "ellipsis", width: '20rem'}}></div>*/}
                            </Grid>
                        </Grid>
                    </Paper>
                </Link>
            </Grid>
        );
    });

    if(webinars.status === 'loading') {
        return(<NewsSkel/>);
    }else if(webinars.status === 'failed') {
        return(<p>Error loading news and events</p>);
    }else {
        return (
            <Card className={classes.root}>
            <CardHeader
                avatar={
                <Avatar aria-label="recipe">
                    <MeetingRoom/>
                </Avatar>
                }
                title="Webinar News"
                subheader="Registration links for webinars around the faculty"
            />
            <CardContent>
                <Box width="100%">
                    <Grid container direction="column" justify="center" alignItems="flex-start" spacing={2}>
                        {webinarsList}
                    </Grid>
                </Box>
            </CardContent>
            </Card>
        );
    }
}
