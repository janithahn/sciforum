import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { 
    InputBase, Button, Container, Grid, Chip, Avatar, Link, makeStyles,
    Card, Paper, Tabs, Tab, withStyles, Typography, IconButton, Menu, 
    MenuItem, Modal, Backdrop, Fade, 
} from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import Moment from 'moment';
import { db } from '../../firebase/config';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Styles.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData as fetchRooms, fetchMessages, fetchRoomUsers } from './actionCreators';
import { RoomDeleteAlert, MessageDeleteAlert } from './alerts';
import AddRoomModal from './addRoomModal';

const TabEnhanced = withStyles((theme) => ({
    root: {
      textTransform: 'none',
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
      margin: theme.spacing(0),
      padding: theme.spacing(0.3),
      '&:hover': {
        color: '#353535',
        opacity: 1,
      },
      '&:focus': {
        color: '#353535',
      },
    },
    selected: {},
  }))((props) => <Tab disableRipple {...props} />);

  const DropDown = ({ anchorEl, handleClick, open, handleClose, id, handleDeleteRoom, handleEditRoom }) => {
        return(
            <div>
                <IconButton
                    aria-label="more"
                    aria-describedby={id}
                    onClick={handleClick}
                    size="small"
                > 
                    <Settings />
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    getContentAnchorEl={null}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <MenuItem onClick={handleEditRoom}>Edit</MenuItem>
                    <MenuItem onClick={handleDeleteRoom}>Delete room</MenuItem>
                </Menu>
        </div>
        );
    }

const snapshotToArray = (snapshot) => {
    const returnArr = [];

    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
}

export default function ChatRoom() {
    const classes = useStyles();
    
    //const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [newchat, setNewchat] = useState({ roomKey: '', username: '', message: '', date: '', type: '' });
    const history = useHistory();
    const { roomKey } = useParams();
    
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [openMessageDeleteModal, setOpenMessageDeleteModal] = React.useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleSettings = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSettingsClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'more-popover' : undefined;

    const dispatch = useDispatch();

    const auth = useSelector(state => state.Auth);
    const chatMessages = useSelector(state => state.ChatMessages);
    const roomusers = useSelector(state => state.RoomUsers);
    const chatRoomsStatus = useSelector(state => state.ChatRooms.status);
    const currentRoom = useSelector(state => state.ChatRooms.rooms.filter(room => room.key === roomKey)[0]);

    useEffect(() => {
        //if(roomKey && roomusers.status === 'idle') dispatch(fetchRoomUsers(roomKey));
    }, [dispatch, roomKey, roomusers]);

    const room = currentRoom ? currentRoom.roomname: null;
    const chats = chatMessages.messages;

    const username = auth.currentUser;

    useEffect(() => {
        if(chatRoomsStatus === 'idle') dispatch(fetchRooms());
    },[dispatch, chatRoomsStatus]);

    /*useEffect(() => {
        const fetchData = () => {
            try {
                setRoomname(room);
                db.ref('chats/').orderByChild('roomname').equalTo(roomname).on('value', resp => {
                  setChats([]);
                  setChats(snapshotToArray(resp));
                }, (error) => {
                    if(error) {
                        console.log(error);
                    }else{
                        console.log("Loaded successfully!");
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };
      
        fetchData();
    }, [db, room, roomname]);*/

    /*useEffect(() => {
        console.log('loading chats');
        db.ref('chats/').orderByChild('roomKey').equalTo(roomKey).on('value', resp => {
            //dispatch(messagesLoaded(snapshotToArray(resp)));
            handleChats(snapshotToArray(resp));
            }, (error) => {
                if(error) {
                    //dispatch(messagesFailed(error));
                    console.log(error);
                }else{
                    console.log("Loaded successfully!");
                }
            });
    }, [roomKey]);*/

    useEffect(() => {
        if(roomKey && chatMessages.status === 'idle') dispatch(fetchMessages(roomKey))
    }, [dispatch, roomKey, chatMessages]);

    useEffect(() => {
        const fetchData = () => {
            try {
                db.ref('roomusers/').orderByChild('roomKey').equalTo(roomKey).on('value', (resp2) => {
                  setUsers([]);
                  const roomusers = snapshotToArray(resp2);
                  setUsers(roomusers.filter(x => x.status === 'online'));
                }, (error) => {
                    if(error) {
                        console.log(error);
                    }else{
                        console.log("Loaded successfully!");
                    }
                });
                
            } catch (error) {
                console.log(error);
            }
        };
      
        fetchData();
    }, [roomKey]);

    const submitMessage = (e) => {
        e.preventDefault();
        const chat = newchat;
        chat.roomKey = roomKey;
        chat.username = username;
        chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
        chat.type = 'message';
        const newMessage = db.ref('chats/').push();
        if(chat.message.trim().length !== 0) newMessage.set(chat)
            .then(() => {
                console.log("Message sent successfully");
            })
            .catch((error) => {
                console.log(error);
            });
        setNewchat({ roomKey: '', username: '', message: '', date: '', type: '' });
    };

    const onChange = (e) => {
        e.persist();
        setNewchat({...newchat, [e.target.name]: e.target.value});
    }

    const exitChat = () => {

        const chat = { roomKey: '', username: '', message: '', date: '', type: '' };
        chat.roomKey = roomKey;
        chat.username = username;
        chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
        chat.message = `${username} leave the room`;
        chat.type = 'exit';
        const newMessage = db.ref('chats/').push();
        newMessage.set(chat);
    
        db.ref('roomusers/').orderByChild('roomKey').equalTo(roomKey).once('value', (resp) => {
          let roomuser = [];
          roomuser = snapshotToArray(resp);
          const user = roomuser.find(x => x.username === username);
          console.log(user)
          if (user !== undefined) {
            const userRef = db.ref('roomusers/').child(user.key);
            userRef.update({status: "offline"})
            .then(() => {
                console.log("Status updated successfully!");
            })
            .catch(() => {
                console.log("Status update failed!");
            });
          }
        });
    
        history.push('/chatrooms');
    }

    //Room edit/delete
    const [openModal, setOpenModal] = React.useState(false);
    
    const handleModalOpen = () => {
        setOpenModal(true);
    };
    
      const handleModalClose = () => {
        setOpenModal(false);
    };

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

    const deleteRoom = () => {
        const roomRef = db.ref('rooms/' + roomKey);
        const roomuserRef = db.ref('roomusers/' + roomKey);
        const chatRef = db.ref('chats/' + roomKey);
  
        if(currentRoom.owner === auth.currentUser){
            roomRef.remove()
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
        }

        roomuserRef.remove()
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.log(error);
        });

        chatRef.remove()
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.log(error);
        });
    };
    
    const handleDeleteModalOpen = () => {
        setOpenDeleteModal(true);
    };

    const handleDeleteModalClose = () => {
        setOpenDeleteModal(false);
    };

    const handleEditRoom = () => {
        handleModalOpen();
    };
    
    //Individual Message
    const [deleteMessageKey, setDeleteMessageKey] = React.useState('');
    const handleMessageDeleteModalOpen = (messageKey) => {
        setDeleteMessageKey(messageKey);
        setOpenMessageDeleteModal(true);
    };

    const handleMessageDeleteModalClose = () => {
        setDeleteMessageKey('');
        setOpenMessageDeleteModal(false);
    };

    const [show, setShow] = useState(false);
    const handleOnMouseOver = () => {
        setShow(true);
    };

    const handleMouseLeave = () => {
        setShow(false);
    };

    const deleteMessage = () => {
        const chatRef = db.ref('chats/').child(deleteMessageKey);
        chatRef.remove()
        .then(() => {
            console.log("Message deleted successfully!");
        })
        .catch((error) => {
            console.log(error);
        });
    };

    /*const [value, setValue] = React.useState(0);
  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };*/

    return (
        <Container>
            <Grid container direction="column" spacing={1}>
                <Grid item xs={12} sm={12} md={8} lg={8}>
                    <Grid container alignItems="center" justify="space-between">
                        <Grid item>
                            <Typography variant="h5">{room ? room: undefined}</Typography>
                        </Grid>
                        <Grid item>
                            {room ? 
                                <Grid container alignItems="center" justify="flex-end" spacing={2}>
                                    <Grid item>
                                        <Button variant="outlined" size="small" color="secondary" style={{textTransform: 'none', padding: '0px 4px 0px 4px'}} onClick={() => exitChat() }>
                                            Exit
                                        </Button>
                                    </Grid>
                                    {currentRoom && currentRoom.owner === auth.currentUser ? <Grid item>
                                        <DropDown 
                                            id={id} 
                                            open={open} 
                                            anchorEl={anchorEl}
                                            handleClick={handleSettings} 
                                            handleClose={handleSettingsClose}
                                            handleEditRoom={handleEditRoom}
                                            handleDeleteRoom={handleDeleteModalOpen}
                                        />
                                    </Grid>: undefined}
                                </Grid>
                                : undefined
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8}>
                    <Grid container direction="row" justify="flex-end" alignItems="center">
                        <Grid item>
                            <Tabs
                                orientation="horizontal"
                                scrollButtons="desktop"
                                variant="scrollable"
                                aria-label="Verticle Tabs for chat online chips"
                            >
                                {users.map((item) => (
                                    <TabEnhanced key={item.key}
                                        label={
                                            <Link href={`/profile/${item.username}`} underline="none" style={{textDecoration: 'none'}}>
                                                <Chip
                                                    variant="outlined"
                                                    size="small"
                                                    avatar={<Avatar alt={item.username} src={item.userAvatar} />}
                                                    label={item.username}
                                                    color="secondary"
                                                    clickable
                                                />
                                            </Link>
                                        }
                                    />    
                                ))}
                            </Tabs>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8}>
                    <div className="ChatBoxDiv">
                        <Card variant="outlined" style={{paddingBottom: 8}}>
                            <ScrollToBottom className="ChatContent">
                                {chats.map((item) => (
                                    <div key={item.key} className="MessageBox" onMouseLeave={() => handleMouseLeave()} onMouseOver={() => handleOnMouseOver()}>
                                        {item.type ==='join' || item.type === 'exit' ?
                                            <div className="ChatStatus">
                                                <span className="ChatDate">{item.date}</span>
                                                <span className="ChatContentCenter">{item.message}</span>
                                            </div>:
                                            <div className="ChatMessage">
                                                <div className={`${item.username === username ? "RightBubble": "LeftBubble"}`} >
                                                    {item.username === username ? 
                                                        <span className="MsgName">Me</span>:<span className="MsgName">{item.username}</span>
                                                    }
                                                    <span className="MsgDate"> at {item.date}</span>
                                                    {item.username === username && show && 
                                                        <Button 
                                                            className={classes.deleteButton} 
                                                            variant="text" 
                                                            size="small"
                                                            onClick={() => handleMessageDeleteModalOpen(item.key)}
                                                        >
                                                            delete
                                                        </Button>}
                                                    <p>{item.message}</p>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                ))}
                            </ScrollToBottom>
                        </Card>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8}>
                    <div>
                        <footer>
                            <div className="StickyFooter">
                                <form onSubmit={submitMessage}>
                                    <Grid container direction="row" alignItems="center" justify="space-between" spacing={0}>
                                        <Grid item lg={11} sm={11} md={10} xs={11}>
                                            <Paper className={classes.paperInput} elevation={0} variant="outlined">
                                                <div className={classes.inputDiv}>
                                                    <InputBase disabled={currentRoom ? false: true} multiline fullWidth type="text" name="message" id="message" placeholder="Enter message here" value={newchat.message} onChange={onChange} />
                                                </div>
                                            </Paper>
                                        </Grid>
                                        <Grid item lg={1} sm={1} md={2} xs={1}>
                                            <Button disabled={currentRoom ? false: true} className={classes.sendButton} variant="text" color="secondary" size="small" style={{textTransform: 'none'}} type="submit">Send</Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </div>
                        </footer>
                    </div>
                </Grid>
            </Grid>
            <RoomDeleteAlert 
                handleDeleteModalClose={handleDeleteModalClose} 
                openDeleteModal={openDeleteModal}
                deleteRoom={deleteRoom}
            />
            <MessageDeleteAlert
                handleDeleteModalClose={handleMessageDeleteModalClose} 
                openDeleteModal={openMessageDeleteModal}
                deleteMessage={deleteMessage}
            />
            <EditModal>
                <Fade in={openModal}>
                    <AddRoomModal 
                        type="edit" 
                        openModal={openModal} 
                        handleModalClose={handleModalClose} 
                        currentRoomname={currentRoom ? currentRoom.roomname: ""} 
                        currentDescription={currentRoom ? currentRoom.description: ""}
                        currentRoomKey={currentRoom ? currentRoom.key: ""}
                    />
                </Fade>
            </EditModal>
        </Container>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    footer: {
        padding: theme.spacing(3, 2),
        marginTop: 'auto',
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        zIndex: theme.zIndex.drawer + 1,
    },
    paperInput: {
        padding: '2px 4px',
        //display: 'flex',
        alignItems: 'center',
        width: '100%'
    },
    inputDiv: {
        marginLeft: theme.spacing(1),
        flex: 1,
        fontSize: 10,
    },
    sendButton: {
        padding: '6px 4px',
    },
    gridList: {
      flexWrap: 'nowrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    scrollButton: {
        padding: 0
    },
    deleteButton: {
        textTransform: 'none', 
        color: '#d32f2f', 
        padding: '9px 0px 9px 0px', 
        marginLeft: 1,
        minHeight: 0,
        maxHeight: 0,
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
}));