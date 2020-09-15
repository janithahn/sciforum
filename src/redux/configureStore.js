import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Posts } from './posts';
import { Auth } from './auth';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            Posts,
            Auth
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}