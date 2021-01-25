import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications } from '../../redux/ActionCreators';
import EnhancedTable from './table';
import TableLoader from './skeletons/tableSkel';

function createData(id, notification, action_object, date, state, actor) {
    return { id, notification, action_object, date, state, actor };
}

export default function Notifications({currentUserId}) {

    const dispatch = useDispatch();

    const notifications = useSelector(state => state.Notifications)
    const auth = useSelector(state => state.Auth);

    React.useEffect(() => {
        if(notifications.status === 'idle') {
            dispatch(fetchNotifications(currentUserId));
        }
    }, [dispatch, notifications, currentUserId]);

    const rows = [];

    if(notifications.status === 'loading' || notifications.status === 'idle') {
        return(<TableLoader/>);
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
        //return(<TableLoader/>);
    }
}