import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Posts } from './posts';
import { Auth } from './auth';
import { User } from './user';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            Posts,
            Auth,
            User,
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}