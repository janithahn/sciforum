import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../redux/ActionCreators';
import EnhancedTable from './table';
import { CircularProgress } from '@material-ui/core';

function createData(id, notification, action_object, date, state, actor) {
    return { id, notification, action_object, date, state, actor };
}

export default function Notifications({currentUserId}) {

    const dispatch = useDispatch();

    const notifications = useSelector(state => state.Notifications)
    const auth = useSelector(state => state.Auth);

    React.useEffect(() => {
        dispatch(fetchNotifications(currentUserId));
    }, [dispatch]);

    const rows = [];

    console.log(notifications);

    if(notifications.status === 'loading' || notifications.status === 'idle') {
        return(<CircularProgress color="secondary" size={15}/>);
    }else if(notifications.errMess) {
        return(<p>Error loading...</p>);
    }else {
        
        notifications.notifications.map(notification => rows.push(createData(
            notification.id,
            notification.verb, 
            notification.action_object, 
            notification.timestamp, 
            notification.unread,
            notification.actor
        )));

        return(<EnhancedTable rows={rows} currentUser={auth.currentUser}/>);
    }
}