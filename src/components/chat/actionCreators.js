import * as ActionTypes from '../../redux/ActionTypes';
import Moment from 'moment';
import { db } from '../../firebase/config';

const snapshotToArray = (snapshot) => {
    const returnArr = [];

    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        item.key = childSnapshot.key;
        returnArr.push(item);
    });

    return returnArr;
}

const addRooms = (data) => ({
    type: ActionTypes.ADD_ROOMS,
    payload: data
});

const roomsLoading = () => ({
    type: ActionTypes.ROOMS_LOADING
});

const roomsFailed = (data) => ({
    type: ActionTypes.ROOMS_FAILED,
    payload: data
});

export const roomsReset = () => ({
    type: ActionTypes.RESET_ROOMS,
});

export const fetchData = () => (dispatch) => {
    //setNickname(localStorage.getItem('nickname'));

    dispatch(roomsLoading());

    /*if(localStorage.getItem("isFirebaseAuthenticated") === "false"){
        firebaseAuth().signInWithCustomToken(localStorage.getItem("firebase_token"))
            .then((user) => {
                console.log("FIREBASE_SUCCESS:", user);
                localStorage.setItem("isFirebaseAuthenticated", true);
            })
            .catch((error) => {
                console.log("FIREBASE_ERROR:", error);
                localStorage.setItem("isFirebaseAuthenticated", false);
        })
        .then(() => {
            db.ref('rooms/').once('value', resp => {
                dispatch(addRooms(snapshotToArray(resp)));
                //setNickname(localStorage.getItem('nickname'));
            }, (error) => {
                if(error) {
                    dispatch(roomsFailed(error));
                    console.log("Rooms failed to load");
                }else {
                    console.log("Rooms loaded successfully");
                }
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }else {*/
        db.ref('rooms/').once('value', resp => {
            dispatch(addRooms(snapshotToArray(resp)));
            //setNickname(localStorage.getItem('nickname'));
        }, (error) => {
            if(error) {
                dispatch(roomsFailed(error));
                console.log("Rooms failed to load");
            }else {
                console.log("Rooms loaded successfully");
            }
        });
    

};

//Room Creation
const roomCreationSuccess = (data) => ({
    type: ActionTypes.ROOM_CREATION_SUCCESS,
    payload: data
});

const roomCreationLoading = () => ({
    type: ActionTypes.ROOM_CREATION_LOADING
});

const roomCreationFailed = (data) => ({
    type: ActionTypes.ROOM_CREATION_FAILED,
    payload: data
});

const roomMessage = (roomKey, currentUser, message) => {
    const chat = { roomKey: '', username: '', message: '', date: '', type: '' };

    chat.roomKey = roomKey;
    chat.username = currentUser;
    chat.date = Moment(new Date()).format('DD/MM/YYYY HH:mm:ss');
    chat.message = `${currentUser} ${message}`;
    chat.type = 'join';
    const newMessage = db.ref('chats/').push();
    newMessage.set(chat)
    .then(() => {
        console.log("Room messaged added successfully!");
    })
    .catch((error) => {
        console.log(error);
    });
}

export const createRoom = (room, handleModalClose) => (dispatch) => {

    dispatch(roomCreationLoading());
    const ref = db.ref('rooms/');

    try {
        ref.orderByChild('roomname').equalTo(room.roomname).once('value', snapshot => {
            if (snapshot.exists()) {
                dispatch(roomCreationFailed({message: "Room name already exists!"}));
            } else {
                const newRoom = db.ref('rooms/').push();
                newRoom.set(room)
                .then(() => {
                    roomMessage(newRoom.key, room.owner, "created the room");
                    dispatch(fetchData());
                })
                .catch((error) => {
                    dispatch(roomCreationFailed(error));
                });
                dispatch(roomCreationSuccess({message: "Room created successfully!"}));
                handleModalClose();
            }
        }, (error) => {
            if(error) {
                dispatch(roomCreationFailed(error));
            }else {
                console.log("Room created successfully!");
            }
        });
        
    } catch (error) {
        dispatch(roomCreationFailed(error));
    }
};

export const editRoom = (room, roomKey, currentRoomname, handleModalClose) => (dispatch) => {
    dispatch(roomCreationLoading());
    const ref = db.ref('rooms/' + roomKey);

    ref.update(room)
    .then((data) => {
        dispatch(roomCreationSuccess(data));
        roomMessage(roomKey, room.owner, `updated room name from ${currentRoomname} to ${room.roomname}`);
        handleModalClose();
        dispatch(fetchData());
    })
    .catch((error) => {
        dispatch(roomCreationFailed(error));
    });
};

//Chat Messages
const messagesLoading = () => ({
    type: ActionTypes.MESSAGES_LOADING
});

const messagesLoaded = (data) => ({
    type: ActionTypes.ADD_MESSAGES,
    payload: data
});

const messagesFailed = (data) => ({
    type: ActionTypes.MESSAGES_FAILED,
    payload: data
});

export const resetMessages = () => ({
    type: ActionTypes.RESET_MESSAGES
});

export const fetchMessages = (roomKey) => (dispatch) => {
    dispatch(messagesLoading());

    try {
        db.ref('chats/').orderByChild('roomKey').equalTo(roomKey).on('value', resp => {
          dispatch(messagesLoaded(snapshotToArray(resp)));
        }, (error) => {
            if(error) {
                dispatch(messagesFailed(error));
            }else{
                console.log("Loaded successfully!");
            }
        });
    } catch (error) {
        dispatch(messagesFailed(error));
    }
};