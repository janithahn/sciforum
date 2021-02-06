import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Moment from 'moment';
import { Button, Card, CardActions, CardContent, Typography, Grid, Modal, Backdrop, Fade, InputBase, Link } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { db } from '../../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData as fetchRooms, resetMessages } from './actionCreators';
import AddRoomModal from './addRoomModal';
import ChatroomPermissionDenied from './permissionDenied';

const useStyles = makeStyles(theme => ({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    search: {
      position: 'relative',
      backgroundColor: '#f5f5f5',
      borderRadius: theme.shape.borderRadius,
      marginRight: theme.spacing(2),
      marginLeft: 10,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#757575'
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
        '&:focus': {
          width: '40ch',
        },
      },
    }
}));

const snapshotToArray = (snapshot) => {
    const returnArr = [];

    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
}

function ChatEnterButton({ roomname, roomKey }) {

    const history = useHistory();
    const auth = useSelector(state => state.Auth);

    const handleChatRoomEnter = () => {

        const chat = { roomKey: '', username: '', message: '', date: '', type: '' };

        chat.roomKey = roomKey;
        chat.username = auth.currentUser;
        chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
        chat.message = `${auth.currentUser} enter the room`;
        chat.type = 'join';
        const newMessage = db.ref('chats/').push();
        newMessage.set(chat);

        const tempArr = JSON.parse(localStorage.getItem('currentUserRoomKeys'));
        tempArr.push(roomKey);
        localStorage.setItem('currentUserRoomKeys', JSON.stringify(tempArr));

        db.ref('roomusers/').orderByChild('roomname').equalTo(roomname).once('value', (resp) => {
            let roomuser = [];
            roomuser = snapshotToArray(resp);
            const user = roomuser.find(x => x.username === auth.currentUser);
            if (user !== undefined) {
                const userRef = db.ref('roomusers/').child(user.key);
                userRef.update({status: "online"});
            } else {
                const newroomuser = { roomKey: '', roomname: '', userId: '', username: '', status: '', userAvatar: '' };

                newroomuser.roomKey = roomKey;
                newroomuser.roomname = roomname;
                newroomuser.username = auth.currentUser;
                newroomuser.userId = auth.currentUserId;
                newroomuser.status = 'online';
                newroomuser.userAvatar = auth.currentUserProfileImg;

                const newRoomUser = db.ref('roomusers/').push();
                newRoomUser.set(newroomuser);
            }
        });
    
        history.push('/chatroom/' + roomKey);
    }

    return(
        <Button 
            style={{textTransform: 'none'}} 
            color="secondary" 
            variant="outlined" 
            size="small" 
            onClick={handleChatRoomEnter}
        >
            Enter
        </Button>
    );
}

export default function RoomList({ setSnackMessage, setSnackOpen }) {

    const classes = useStyles();

    const dispatch = useDispatch();
    const chatRooms = useSelector(state => state.ChatRooms);
    const messages = useSelector(state => state.ChatMessages);
    const auth = useSelector(state => state.Auth);
    const authFirebase = useSelector(state => state.AuthFirebase);

    const [room, setRooms] = React.useState(chatRooms.rooms);

    const [searchParams, setSearchParams] = React.useState('');
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            setRooms(chatRooms.rooms.filter(item => 
                item.roomname.includes(searchParams) || item.description.includes(searchParams) || item.owner.includes(searchParams))
            );
        }
    };

    const [openModal, setOpenModal] = React.useState(false);

    useEffect(() => {
        if(chatRooms.status === 'idle' && authFirebase.isAuthenticated) dispatch(fetchRooms());
    }, [dispatch, chatRooms, authFirebase]);

    useEffect(() => {
        if(messages.status === 'succeeded') dispatch(resetMessages());
    }, [dispatch, messages]);

    const EditModal = ({...rest}) => (
        <Modal {...rest}
          open={openModal} 
          className={classes.modal} 
          onClose={handleModalClose}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
              timeout: 500,
          }}
        />
    );

    const handleModalOpen = () => {
      setOpenModal(true);
    };
  
    const handleModalClose = () => {
      setOpenModal(false);
    };

    const RoomList = room.map((item) => (
        <Grid item key={item.key}>
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textPrimary" gutterBottom>
                        <strong>{item.roomname}</strong>
                    </Typography>
                    <Typography variant="body2" /*color="textSecondary"*/ component="p">
                        {item.description}
                    </Typography>
                </CardContent>

                <CardActions>
                    <Grid container justify="space-between" alignItems="flex-end">
                        <Grid item>
                            <ChatEnterButton 
                                roomname={item.roomname}
                                roomKey={item.key}
                            />
                        </Grid>
                        <Grid item>
                            <Link href={`/profile/${item.owner}`} underline="none" color="inherit">
                                <Typography variant="subtitle2" color="textSecondary">{item.owner}</Typography>
                            </Link>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Grid>
    ));

    if(authFirebase.status === 'loading') {
        return(<div></div>)
    }else if(authFirebase.status === 'failed') {
        return(<ChatroomPermissionDenied/>)
    }else {
        return (
            <div>
                {/*{username} <Button style={{textTransform: 'none'}} onClick={() => logout()} size="small">Logout</Button>*/}
                <Grid container direction="row" justify="space-between" alignItems="center" spacing={2}>
                    <Grid item>
                        <Typography variant="h5">Chat Rooms</Typography>
                    </Grid>
                    <Grid item>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <Search />
                            </div>
                            <InputBase
                                placeholder="Search Chat Rooms…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={(event) => {
                                    setSearchParams(event.target.value)
                                }}
                                onKeyDown={(event) => handleKeyDown(event)}
                            />
                        </div>
                    </Grid>
                    <Grid item>
                        {auth.isAuthenticated ? 
                            <Button
                                style={{textTransform: 'none'}} 
                                color="secondary" 
                                variant="outlined" 
                                size="small" 
                                onClick={handleModalOpen}
                            >
                                Add Room
                            </Button>:
                            undefined
                        }
                    </Grid>
                </Grid>
                <br/>
                <Grid container direction="row" justify="flex-start" alignItems="stretch" spacing={2}>
                    {RoomList}
                </Grid>
                <EditModal>
                    <Fade in={openModal}>
                        <AddRoomModal 
                            type="create" 
                            openModal={openModal} 
                            handleModalClose={handleModalClose}
                            setSnackMessage={setSnackMessage}
                            setSnackOpen={setSnackOpen}
                        />
                    </Fade>
                </EditModal>
            </div>
        );
    }

}