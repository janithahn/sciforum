import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Posts } from './posts';

export const ConfigureStore = () => {
    const store = createStore(
        combineReducers({
            Posts,
        }),
        applyMiddleware(thunk, logger)
    );

    return store;
}