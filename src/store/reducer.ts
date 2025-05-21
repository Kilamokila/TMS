import { apiSlice } from '@services/api/rtkQuery/apiSlice';

import { ROLES_REDUCER_NAME, reducer as rolesReducer } from './reducers/roles';
import { notificationSlice } from './slices/notificationSlice';

export const reducer = {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [ROLES_REDUCER_NAME]: rolesReducer,
    [notificationSlice.reducerPath]: notificationSlice.reducer,
};
