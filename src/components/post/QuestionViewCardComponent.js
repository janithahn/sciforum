import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './styles/cardStyles';
import { Link } from 'react-router-dom';

export default function QuestionViewCard(props) {
    const classes = useStyles();

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <CardActions>
                    <Link to={`/questions/${props.item.id}`} style={{textDecoration: 'none'}}>
                        <Typography variant="h5" component="h2">
                            {props.item.title}
                        </Typography>
                    </Link>
                </CardActions>
                <Typography variant="body2" component="p">
                    {props.item.body}
                </Typography>
            </CardContent>
        </Card>
    );
}