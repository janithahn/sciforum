import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { FormGroup, FormLabel, Input, Button } from '@material-ui/core';
import { db } from '../../firebase/config';
import { useSelector, useDispatch } from 'react-redux';
import { ChatRoomAlertError } from './alerts';
import { createRoom } from './actionCreators';

export default function AddRoom() {

    const auth = useSelector(state => state.Auth);
    const createChatRoom = useSelector(state => state.CreateChatRoom);
    const dispatch = useDispatch();

    const history = useHistory();
    const [room, setRoom] = useState({ roomname: '', description: '' , owner: auth.currentUser, ownerId: auth.currentUserId});
    const [showLoading, setShowLoading] = useState(false);
    const ref = db.ref('rooms/');

    const save = (e) => {
        e.preventDefault();
        //setShowLoading(true);
        /*ref.orderByChild('roomname').equalTo(room.roomname).once('value', snapshot => {
            if (snapshot.exists()) {
                setShowLoading(false);
                return (
                    <ChatRoomAlertError primaryMessage={"Rooms name already exists"} strongMessage={"try a different one!"}/>
                );
            } else {
                const newRoom = db.ref('rooms/').push();
                newRoom.set(room);
                history.goBack();
                setShowLoading(false);
            }
        });*/
        dispatch(createRoom(room, ref));
    };

    const onChange = (e) => {
        e.persist();
        setRoom({...room, [e.target.name]: e.target.value});
    }

    return (
        <div>
            {createChatRoom.status === 'loading' &&
                <p>Loading...</p>
            }
            <div>
                <h2>Please enter new Room</h2>
                <form onSubmit={save}>
                    <FormGroup>
                        <FormLabel>Room Name</FormLabel>
                        <Input type="text" name="roomname" id="roomname" placeholder="Enter Room Name" value={room.roomname} onChange={onChange} />
                    </FormGroup>
                    <Button color="secondary" size="small" variant="outlined" type="submit">
                        Add
                    </Button>
                </form>
            </div>
        </div>
    );

}