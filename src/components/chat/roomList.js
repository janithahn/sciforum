import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import Moment from 'moment';
import { Button, Card, CardActions, CardContent, Typography, Grid, 
    Modal, Backdrop, Fade, InputBase, Link, IconButton, Tooltip, Popper, 
    Grow, MenuList, MenuItem, ClickAwayListener, Paper, Avatar, Box } from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { Search, FilterList } from '@material-ui/icons';
import { db } from '../../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData as fetchRooms, resetMessages } from './actionCreators';
import AddRoomModal from './addRoomModal';
import ChatroomPermissionDenied from './permissionDenied';
import { useRoomListStyles } from './styles/styles';

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

        db.ref('roomusers/').orderByChild('roomKey').equalTo(roomKey).once('value', (resp) => {
            let roomuser = [];
            roomuser = snapshotToArray(resp);
            const user = roomuser.find(x => x.username === auth.currentUser);
            if (user !== undefined) {
                const userRef = db.ref('roomusers/').child(user.key);
                userRef.update({status: "online", userAvatar: auth.currentUserProfileImg});
            } else {
                const newroomuser = { roomKey: '', userId: '', username: '', status: '', userAvatar: '' };

                newroomuser.roomKey = roomKey;
                //newroomuser.roomname = roomname;
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

const FilterMenu = ({ open, setOpen, anchorRef, filterByDate, filterByUsers, filterByDefault }) => {

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return(
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <MenuItem onClick={(event) => filterByDate(event)}>Date Created</MenuItem>
                    <MenuItem onClick={(event) => filterByUsers(event)}>Users Count</MenuItem>
                    <MenuItem onClick={(event) => filterByDefault(event)}>Default</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
    );
}

export default function RoomList({ setSnackMessage, setSnackOpen }) {

    const classes = useRoomListStyles();

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
                item.roomname.toLowerCase().includes(searchParams.toLowerCase()) || 
                item.description.toLowerCase().includes(searchParams.toLowerCase()) || 
                item.owner.toLowerCase().includes(searchParams.toLowerCase()))
            );
        }
    };

    const [openModal, setOpenModal] = React.useState(false);

    //filter list
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const filterByDate = (event) => {
        setRooms(chatRooms.rooms.slice().sort((a, b) => {
            const adate = Date.parse(a.created_at);
            const bdate = Date.parse(b.created_at);
            return bdate - adate;
        }));
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    //fetching room users
    const [usersList, setUsersList] = React.useState([]);
    const [userAvatars, setUserAvatars] = React.useState([]);
    //const [usersCount, setUsersCount] = React.useState([]);
    /*console.log(usersList.filter((thing, index) => {
        const _thing = JSON.stringify(thing);
        return index === usersList.findIndex(obj => {
          return JSON.stringify(obj) === _thing;
        });
    }));*/
    console.log(userAvatars);
    useEffect(() => {
        db.ref('rooms/').once('value', roomresp => {
            const rooms = snapshotToArray(roomresp);

            rooms.forEach((room) => {
                db.ref('roomusers/').orderByChild('roomKey').equalTo(room.key).once('value', (roomusersresp) => {
                    let count = snapshotToArray(roomusersresp).length;
                    let userAvatars = [];
                    setUsersList(oldArray => [...oldArray, {key: room.key, count: count}]);
                    
                    //taking avatars of chat room users with a promise
                    new Promise((accept, reject) => {
                        snapshotToArray(roomusersresp).forEach((elem) => {
                            userAvatars.push({username: elem.username, avatar: elem.userAvatar});
                        });
                        accept(userAvatars);
                    })
                    .then((res) => {
                        setUserAvatars(oldArray => [...oldArray, {key: room.key, avatars: res}]);
                        console.log(room.roomname, res);
                    });
                });
            });
        }, (error) => {
            if(error) {
                console.log("Counting room users failed");
            }else {
                console.log("Counting room users successfull");
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    //this function sorts an array based on another sorted array
    function mapOrder (array, order, key) {
  
        array.sort( function (a, b) {
          var A = a[key], B = b[key];
          
          if (order.indexOf(A) > order.indexOf(B)) {
            return 1;
          } else {
            return -1;
          }
          
        });
        
        return array;
    };

    const filterByUsers = (event) => {
        let sortedArr = usersList.slice().sort((a, b) => {
            let acount = a.count;
            let bcount = b.count;
            return bcount - acount;
        }).map(item => item.key);

        setRooms(mapOrder(chatRooms.rooms.slice(), sortedArr, 'key'));

        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const filterByDefault = (event) => {
        setRooms(chatRooms.rooms);
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    //end filter list

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

    //this function shuffles arrays
    function shuffle(array) {
        var tmp, current, top = array.length;
    
        if(top) while(--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    
        return array;
    }

    const RoomList = room.map((item) => {
        let created_at = '';
        if(item.created_at) {
            const tempDate = Date.parse(item.created_at);
            const year = new Date(tempDate).getFullYear();
            const month = new Date(tempDate).getMonth();
            const day = new Date(tempDate).getDate();
            const hour = new Date(tempDate).getHours();
            const minute = new Date(tempDate).getMinutes();
            created_at = `${day}/${month}/${year}-${hour}:${minute}`;
        }

        let usersCount = 0;
        usersList.forEach((elem) => {
            if(elem.key === item.key)
                usersCount = elem.count;
        });

        let avatarList = [];
        userAvatars.forEach((elem) => {
            if(elem.key === item.key)
                avatarList = elem.avatars;
        });

        return (
        <Grid item key={item.key}>
            <Card className={classes.root} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textPrimary" gutterBottom>
                        <strong>{item.roomname}</strong>
                    </Typography>
                    <Typography variant="body2" /*color="textSecondary"*/ component="p">
                        {item.description}
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                        {`${usersCount} People`}
                    </Typography>
                    <AvatarGroup max={4}>
                        {avatarList.length !== 0 ? shuffle(avatarList).map((avatar) => (
                            <Tooltip arrow title={avatar.username}>
                                <Avatar className={classes.avatars} alt={avatar.username} src={avatar.avatar} />
                            </Tooltip>
                        )): <div style={{opacity: 0}} className={classes.avatars}></div>}
                    </AvatarGroup>
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
                            <Grid container direction="column" alignItems="flex-end">
                                <Grid item>
                                    <Link href={`/profile/${item.owner}`} underline="none" color="inherit">
                                        <Typography variant="subtitle2" color="textSecondary">{item.owner}</Typography>
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle2" style={{fontSize: 10, fontStyle: "italic"}} color="textSecondary">
                                        {created_at}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Grid>)
    });

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
                        <Grid container alignItems="center" justify="flex-end" spacing={2}>
                            <Grid item>
                                <Tooltip title="Filter Chat Rooms By">
                                    <IconButton size="small"
                                        ref={anchorRef}
                                        aria-controls={open ? 'menu-list-grow' : undefined}
                                        aria-haspopup="true"
                                        onClick={handleToggle}
                                    >
                                        <FilterList/>
                                    </IconButton>
                                </Tooltip>
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
                <FilterMenu 
                    open={open} 
                    setOpen={setOpen} 
                    anchorRef={anchorRef}
                    filterByDate={filterByDate}
                    filterByUsers={filterByUsers}
                    filterByDefault={filterByDefault}
                />
            </div>
        );
    }

}