import { createAction } from '@reduxjs/toolkit';

import { UserRole } from '@context/auth/types/types';

export const setRoles = createAction<UserRole[]>('SET_USER_ROLES');
export const clearRolesState = createAction<void>('CLEAR_ROLES_STATE');
