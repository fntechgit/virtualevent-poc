import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { loggedUserReducer } from 'openstack-uicore-foundation/lib/reducers';
import eventReducer from '../reducers/event-reducer'
import summitReducer from '../reducers/summit-reducer'
import userReducer from '../reducers/user-reducer'
import scheduleReducer from '../reducers/schedule-reducer'
import clockReducer from '../reducers/clock-reducer'

import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/es/storage' // default: localStorage if web, AsyncStorage if react-native
import { PersistGate } from 'redux-persist/integration/react';

const onBeforeLift = () => {
  console.log("reading state ...")
}

const clientId = typeof window === 'object' ? window.OAUTH2_CLIENT_ID : process.env.OAUTH2_CLIENT_ID

const config = {
  key: `root_${clientId}`,
  storage,
}

const persistedReducers = persistCombineReducers(config, {
  loggedUserState: loggedUserReducer,
  eventState: eventReducer,
  summitState: summitReducer,
  userState: userReducer,
  scheduleState: scheduleReducer,
  clockState: clockReducer
});

const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const store = createStore(persistedReducers, composeEnhancers(applyMiddleware(thunk)));

const onRehydrateComplete = () => { }

const persistor = persistStore(store, null, onRehydrateComplete);

export default ({ element }) => (
  <Provider store={store}>
    <PersistGate onBeforeLift={onBeforeLift} persistor={persistor}>
      {element}
    </PersistGate>
  </Provider>
);