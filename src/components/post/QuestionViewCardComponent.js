import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import { useStyles } from './styles/cardStyles';
//import { Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { fetchPostDetail } from '../../redux/ActionCreators';
import { useDispatch } from 'react-redux';

export default function QuestionViewCard(props) {
    const classes = useStyles();
    
    const dispatch = useDispatch();

    const { item } = props;

    const RenderPostTags = item.tags ? item.tags.map((tag, key) => 
        <Grid item key={key}>
            <Chip className={classes.chip} color="secondary" size="small" variant="outlined" label={tag} key={key} component="a" href={`/questions/tagged/${tag}`} clickable/>
        </Grid>): [];

    const handleClick = () => {
        dispatch(fetchPostDetail(item.id));
    };

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <CardActions>
                    <RouterLink onClick={handleClick} to={`/questions/${item.id}/`} style={{textDecoration: 'none', color: 'inherit'}}>
                        <Typography variant="h5" component="h2">
                            {item.title}
                        </Typography>
                    </RouterLink>
                </CardActions>
                <Grid container direction="row" alignItems="center" spacing={2}>
                    <Grid item>
                        <Typography variant="body2" component="p">
                            {item.likes}{item.likes === 1 ? " Like": " Likes"}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" component="p">
                            {item.answers}{item.answers === 1 ? " Answer": " Answers"}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2" component="p">
                            {item.viewCount}{item.viewCount === 1 ? " View": " Views"}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Grid container direction="row" alignItems="center" spacing={1}>
                            {RenderPostTags}
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}