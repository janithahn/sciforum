import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Posts } from './actions/posts';
import { Auth } from './actions/auth';
import { User } from './actions/user';
import { Post } from './actions/post';
import { Answers } from './actions/answers';
import { answerVotes } from './actions/votes';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            Posts,
            Auth,
            User,
            Post,
            Answers,
            answerVotes,
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}