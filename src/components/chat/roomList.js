import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import Moment from 'moment';
import { Button, Card, CardActions, CardContent, Typography, Grid, Modal, Backdrop, Fade, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { db } from '../../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData as fetchRooms } from './actionCreators';
import AddRoomModal from './addRoomModal';

const useStyles = makeStyles({
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
});

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

        const chat = { roomKey: '', roomname: '', username: '', message: '', date: '', type: '' };

        chat.roomKey = roomKey;
        chat.roomname = roomname;
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

export default function RoomList() {

    const classes = useStyles();

    const dispatch = useDispatch();
    const chatRooms = useSelector(state => state.ChatRooms);
    const auth = useSelector(state => state.Auth);

    const [openModal, setOpenModal] = React.useState(false);

    const room = chatRooms.rooms;
    const history = useHistory();

    useEffect(() => {
        if(chatRooms.status === 'idle') dispatch(fetchRooms());
    }, [dispatch, chatRooms]);

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

    const logout = () => {
        localStorage.removeItem('username');
        history.push('/chatlogin');
    }

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
                    <ChatEnterButton 
                        roomname={item.roomname}
                        roomKey={item.key}
                    />
                </CardActions>
            </Card>
        </Grid>
    ));

    return (
        <div>
            {/*{username} <Button style={{textTransform: 'none'}} onClick={() => logout()} size="small">Logout</Button>*/}
            <Grid container direction="row" justify="space-between" alignItems="center" spacing={2}>
                <Grid item>
                    <Typography variant="h5">Chat Rooms</Typography>
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
                    <AddRoomModal openModal={openModal} handleModalClose={handleModalClose}/>
                </Fade>
            </EditModal>
        </div>
    );

}