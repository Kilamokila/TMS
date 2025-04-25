//import React, { useEffect } from 'react';
import { Outlet } from '@tanstack/react-router';
//import { useKeycloak } from './useKeycloak';

export const ProtectedRoute: React.FC = () => {
    // const { initialized, getAccessToken, updateToken, keycloak } = useKeycloak();

    // useEffect(() => {
    //     if (initialized && !getAccessToken()) {
    //         updateToken().catch(() => {
    //             keycloak?.login();
    //         });
    //     }
    // }, [initialized, getAccessToken, updateToken]);

    // if (!initialized || !getAccessToken()) {
    //     return <div>Загрузка...</div>;
    // }

    return <Outlet />;
};
