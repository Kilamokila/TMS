import React, { useEffect } from 'react';
import { Outlet } from '@tanstack/react-router';
import { useKeycloak } from './useKeycloak';
import { getKeycloakToken } from './KeycloakProvider';

export const ProtectedRoute: React.FC = () => {
    const { initialized, updateToken, keycloak } = useKeycloak();

    useEffect(() => {
        if (initialized && !getKeycloakToken()) {
            updateToken().catch(() => {
                keycloak?.login();
            });
        }
    }, [initialized, updateToken, keycloak]);

    if (!initialized || !getKeycloakToken()) {
        return <div>Загрузка...</div>;
    }

    return <Outlet />;
};
