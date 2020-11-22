import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Posts } from './actions/posts';
import { Auth } from './actions/auth';
import { User } from './actions/user';
import { Post } from './actions/post';
import { Answers } from './actions/answers';
import { answerVotes, postVotes } from './actions/votes';
import { Notifications } from './actions/notifications';
import { MyPosts } from './actions/myposts';
import { createReduxHistoryContext, reachify } from "redux-first-history";
import { createBrowserHistory } from 'history';
import { globalHistory } from "@reach/router";

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({ 
    history: createBrowserHistory(),
    reachGlobalHistory: globalHistory,
    //other options if needed 
});

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            router: routerReducer,
            Posts,
            Auth,
            User,
            Post,
            Answers,
            answerVotes,
            postVotes,
            Notifications,
            MyPosts,
        }),
        applyMiddleware(thunk, logger, routerMiddleware)
    );

    return store;
}

export const history = createReduxHistory(ConfigureStore());
//if you use @reach/router 
export const reachHistory = reachify(history);