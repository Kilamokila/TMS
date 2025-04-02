import React from 'react';
//import { useEffect } from 'react';
import { Outlet } from '@tanstack/react-router';
//import { useKeycloak } from './useKeycloak';

export const ProtectedRoute: React.FC = () => {
    // const { initialized, keycloak } = useKeycloak();

    // useEffect(() => {
    //     if (initialized) {
    //         if (!keycloak?.authenticated) {
    //             keycloak?.login();
    //         }
    //     }
    // }, [initialized, keycloak]);

    // if (!initialized || !keycloak?.authenticated) {
    //     return <div>Загрузка...</div>;
    // }

    return <Outlet />;
};
