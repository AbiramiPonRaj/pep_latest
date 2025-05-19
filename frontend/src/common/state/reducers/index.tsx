// C:\Users\ADMIN\Desktop\projects\crm-web-app1\src\common\state\reducers\index.tsx

import { combineReducers } from 'redux';
import loginReducer from '../../../pages/login/State/LoginReducer';

export const rootReducer = combineReducers({
  loginReducer: loginReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
