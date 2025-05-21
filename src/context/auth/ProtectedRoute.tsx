import React, { useEffect } from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useKeycloak } from './useKeycloak';
import { LoadingSplash } from '@components/common/loader';
import { ROUTES } from '@router/routes';

export const ProtectedRoute: React.FC = () => {
    const { initialized, isAuthenticated } = useKeycloak();
    const navigate = useNavigate();

    useEffect(() => {
        if (initialized && !isAuthenticated()) {
            navigate({ to: `/${ROUTES.LANDING}`, replace: true });
        }
    }, [initialized, isAuthenticated, navigate]);

    if (!initialized) {
        return <LoadingSplash />;
    }

    if (isAuthenticated()) {
        return <Outlet />;
    }

    return <LoadingSplash />;
};
