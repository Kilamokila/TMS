import React, { useEffect } from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useKeycloak } from './useKeycloak';
import { LoadingSplash } from '@components/common/loader';

export const ProtectedRoute: React.FC = () => {
    const { initialized, isAuthenticated } = useKeycloak();
    const navigate = useNavigate();

    useEffect(() => {
        if (initialized && !isAuthenticated()) {
            navigate({ to: '/' });
        }
    }, [initialized, isAuthenticated]);

    if (!initialized || !isAuthenticated()) {
        return <LoadingSplash />;
    } else {
        return <Outlet />;
    }
};
