import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@store/store';
import { UserRole } from '@context/auth/types/types';

import { ROLES_REDUCER_NAME, RolesState } from '.';

const selectDomain = (state: RootState): RolesState => state[ROLES_REDUCER_NAME];

export const selectUserRoles = createSelector(selectDomain, (state): UserRole[] => state.roles);

export const selectUserHasRoles = (roles: UserRole[]) =>
    createSelector(selectUserRoles, (userRoles) => userRoles.some((userRole) => roles.includes(userRole)));
