import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useStyles } from './styles/cardStyles';
import { Link } from '@material-ui/core';
//import { Link as RouterLink } from 'react-router-dom';

export default function QuestionViewCard(props) {
    const classes = useStyles();

    const { item } = props;

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <CardActions>
                    <Link href={`/questions/${item.id}/`} style={{textDecoration: 'none', color: 'inherit'}}>
                        <Typography variant="h5" component="h2">
                            {item.title}
                        </Typography>
                    </Link>
                </CardActions>
                <Typography variant="body2" component="p">
                    {item.body}
                </Typography>
            </CardContent>
        </Card>
    );
}