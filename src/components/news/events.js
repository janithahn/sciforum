import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import Link from '@material-ui/core/Link';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { LineWeight } from '@material-ui/icons';
import axios from 'axios';
import { Grid } from '@material-ui/core';

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

  const eventsUrl = 'http://127.0.0.1:8000/news/events/?ordering=-created_at';
  const [events, setEvents] = React.useState([]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleSetEvents = (data) => {
    setEvents(data)
  };

  const fetchEvents = () => {
    axios.get(eventsUrl)
    .then((res) => {
        console.log(res.data);
        handleSetEvents(res.data.results);
    })
    .catch((error) => {
        console.log(error);
    });
  }

  React.useEffect(() => {
      fetchEvents();
  }, []);

  const eventsList = events.map((event) => {
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
      {/*<CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
            minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
            heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
            browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
            and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
            pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
            without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
            medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
            again without stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don’t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
        </Collapse>*/}
    </Card>
  );
}
