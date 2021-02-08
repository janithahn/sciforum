import React from 'react';
import QuestionAnswerRoundedIcon from '@material-ui/icons/QuestionAnswerRounded';
import { Button, Typography, Divider, Grid, Hidden, Link } from '@material-ui/core';
import { Preview } from './MarkdownPreview';
import TimeAgo from 'react-timeago';
import LoginModal from '../sign/LoginModal';
import { useSelector } from 'react-redux';
import { labels } from './styles/labelStyles';

export default function RenderCard({title, body, label, viewCount, created_at, updated_at, owner, handleModalOpen, classes}) {

    /*function getTime(date) {
        return new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date)
    }*/

    const auth = useSelector(state => state.Auth);

    const labelColor = label ? labels.filter((l) => l.name === label)[0].color: '';
    const [openModal, setOpenModal] = React.useState(false);

    const handleLoginModalOpen = () => {
        setOpenModal(true);
    };

    const handleLoginModalClose = () => {
        setOpenModal(false);
    };

    const handleAnswerButton = () => {
        if(auth.isAuthenticated) {
            handleModalOpen();
        }else {
            handleLoginModalOpen();
        }
    }

    return(
       <Grid container direction="column" spacing={1}>
           <Grid item>
                <Divider style={{padding: 1, background: labelColor}}/>
                <Typography variant="h5" gutterBottom>
                    {title}
                </Typography>
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item>
                        <Grid container direction="row" alignItems="flex-start" justify="flex-start" spacing={3}>
                            <Grid item>
                                <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                    {"Posted by  "}
                                    <Link style={{textDecoration: 'none', fontSize: 14}} href={`/profile/${owner}/`}>{owner}</Link>
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                    {viewCount === 1 ? `${viewCount} View`: `${viewCount} Views`}
                                </Typography>
                            </Grid>
                            <Hidden smDown>
                                <Grid item>
                                    <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                        {"Created "}<TimeAgo live={false} date={created_at} />
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography style={{fontSize: 13}} variant="body2" color="textSecondary">
                                        {"Updated "}<TimeAgo live={false} date={updated_at} />
                                    </Typography>
                                </Grid>
                            </Hidden>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button className={classes.answerButton} onClick={() => handleAnswerButton()}>
                            <Typography className={classes.iconWrap} variant="body2">
                                <QuestionAnswerRoundedIcon/>{" Answer"}
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Divider/>
            </Grid>
            <Grid item>
                <Preview source={body}/>
            </Grid>
            <Grid item>
                <Divider/>
            </Grid>
            <LoginModal openModal={openModal} classes={classes} handleModalClose={handleLoginModalClose}/>
       </Grid>
    );
    
}