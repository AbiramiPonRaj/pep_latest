// import { createStore } from 'redux';
// import allReducers from '../reducers';

// const store = createStore(allReducers);

// export default store;
// store.ts
// store.js
// store.ts


import { createStore, combineReducers } from 'redux';
import loginReducer from '../../../pages/login/State/LoginReducer';

const rootReducer = combineReducers({
  loginReducer: loginReducer,
});

const store = createStore(rootReducer);

export default store;



