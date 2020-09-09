import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useStyles } from '../styles/cardStyles';
import { Link } from 'react-router-dom';

export default function QuestionViewCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          {props.item.title}
        </Typography>
        <Typography variant="body2" component="p">
          {props.item.body}
        </Typography>
      </CardContent>
      <CardActions>
        <Link to={`/questions/${props.item.id}`} style={{textDecoration: 'none'}}>
            <Button size="small">View Question</Button>
        </Link>
      </CardActions>
    </Card>
  );
}