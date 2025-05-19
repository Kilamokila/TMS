import { createReducer } from '@reduxjs/toolkit';

import { UserRole } from '@context/auth/types/types';
import { clearRolesState, setRoles } from './actions';

export const ROLES_REDUCER_NAME = 'roles';

export type RolesState = {
    roles: UserRole[];
};

const initialState: RolesState = {
    roles: [],
};

export const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setRoles, (state, action) => ({
            ...state,
            roles: action.payload,
        }))
        .addCase(clearRolesState, () => initialState);
});
