import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Posts } from './actions/posts';
import { PostImages } from './actions/postImages';
import { Auth } from './actions/auth';
import { AuthFirebase } from './actions/authFirebase';
import { User } from './actions/user';
import { DeleteUser } from './actions/deleteUser';
import { UserEmployment } from './actions/credentials/employment';
import { UserEducation } from './actions/credentials/education';
import { UserLanguages } from './actions/credentials/languages';
import { UserSkills } from './actions/credentials/skills';
import { UserContact } from './actions/credentials/contact';
import { Post } from './actions/post';
import { Answers } from './actions/answers';
import { ChatRooms } from './actions/chat/chatRooms';
import { CreateChatRoom } from './actions/chat/createChatRoom';
import { ChatMessages } from './actions/chat/chatMessages';
import { ResetPassword, SendResetPassword } from './actions/resetPassword';
import { answerVotes, postVotes } from './actions/votes';
import { answerCommentVotes, postCommentVotes } from './actions/commentVotes';
import { Notifications, UnreadNotifications } from './actions/notifications';
import { MyPosts } from './actions/myposts';
import { PostComments, AnswerComments } from './actions/comments';
import { events, webinars } from './actions/news';
import { TopPosts } from './actions/topposts';
import { LikedPosts } from './actions/profilePanels/liked';
import { MyAnswers } from './actions/profilePanels/myAnswers';
import { createReduxHistoryContext, reachify } from "redux-first-history";
import { createBrowserHistory } from 'history';
import { globalHistory } from "@reach/router";

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({ 
    history: createBrowserHistory(),
    reachGlobalHistory: globalHistory,
    //other options if needed 
});

export const ConfigureStore = () => {

    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
        combineReducers({
            router: routerReducer,
            Posts,
            PostImages,
            Auth,
            AuthFirebase,
            User,
            DeleteUser,
            UserEmployment,
            Post,
            Answers,
            answerVotes,
            postVotes,
            answerCommentVotes,
            postCommentVotes,
            Notifications,
            UnreadNotifications,
            MyPosts,
            UserEducation,
            UserLanguages,
            UserSkills,
            UserContact,
            PostComments,
            AnswerComments,
            ResetPassword,
            SendResetPassword,
            ChatRooms,
            CreateChatRoom,
            ChatMessages,
            events,
            webinars,
            TopPosts,
            LikedPosts,
            MyAnswers,
        }),
        composeEnhancers(applyMiddleware(thunk, logger, routerMiddleware))
    );

    return store;
}

export const history = createReduxHistory(ConfigureStore());
//if you use @reach/router 
export const reachHistory = reachify(history);