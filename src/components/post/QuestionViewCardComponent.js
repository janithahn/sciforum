import React from 'react';
import Card from '@material-ui/core/Card';
import Link from '@material-ui/core/Link'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useStyles } from './styles/cardStyles';
import { labels } from '../post/styles/labelStyles';

export default function QuestionViewCard(props) {
    const classes = useStyles();
    
    const truncate = (input) => input.length > 250 ? `${input.substring(0, 250)}...` : input;

    const { item } = props;
    const labelColor = labels.filter((label) => label.name === item.label)[0].color;

    const RenderPostTags = item.tags ? item.tags.map((tag, key) => 
        <Grid item key={key}>
            <Chip className={classes.chip} color="secondary" size="small" variant="outlined" label={tag} key={key} component="a" href={`/tagged/${tag}`} clickable/>
        </Grid>): [];

    return (
        <Card className={classes.root} variant="outlined">
            <CardMedia elevation={0} style={{padding: 1, backgroundColor: labelColor}}/>
            <CardContent>
                <CardActions>
                    <Link underline="none"  href={`/questions/${item.id}/`} style={{textDecoration: 'none', color: 'inherit'}}>
                        <Grid container direction="column" justify="center" alignItems="flex-start">
                            <Grid item>
                                <Typography variant="h5" component="h2">
                                    {item.title}
                                </Typography>
                            </Grid>
                            <Grid>
                                <MarkdownPreview source={truncate(item.body)}/>
                            </Grid>
                        </Grid>
                    </Link>
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