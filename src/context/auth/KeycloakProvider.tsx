import React, { useEffect, useState, useRef } from 'react';
import Keycloak from 'keycloak-js';
import { KeycloakContext } from './KeycloakContext';
import { CLIENT_URL, KEYCLOAK_CONFIG } from '@constants/environment';
import { TKeycloakToken, IKeycloakContextProps } from './types/types';
import { ROUTES } from '@router/routes';
import { LoadingSplash } from '@components/common/loader';

const initOptions: Keycloak.KeycloakConfig = {
    url: KEYCLOAK_CONFIG.URL,
    realm: KEYCLOAK_CONFIG.REALM,
    clientId: KEYCLOAK_CONFIG.CLIENT_ID,
};

export const keycloakInstance = new Keycloak(initOptions);

let keycloakInitPromise: Promise<boolean> | null = null;

export const getKeycloakInitPromise = () => keycloakInitPromise;

export const tokenManager = (() => {
    let accessToken: TKeycloakToken = null;

    return {
        getAccessToken: () => accessToken,
        setAccessToken: (token: TKeycloakToken) => {
            accessToken = token;
        },
    };
})();

export const getKeycloakToken = () => tokenManager.getAccessToken();
export const setKeycloakToken = (token: TKeycloakToken) => tokenManager.setAccessToken(token);

export const KeycloakProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [initialized, setInitialized] = useState<boolean>(false);
    const providerValueRef = useRef<IKeycloakContextProps | null>(null);

    useEffect(() => {
        keycloakInitPromise = keycloakInstance
            .init({
                checkLoginIframe: false,
                pkceMethod: 'S256',
                onLoad: 'check-sso',
                redirectUri: `${CLIENT_URL}/${ROUTES.PROJECTS}`,
            })
            .then((authenticated) => {
                setInitialized(true);

                if (authenticated) {
                    setKeycloakToken(keycloakInstance.token);
                }

                return authenticated;
            })
            .catch((error) => {
                console.error('Failed to initialize Keycloak', error);
                setInitialized(true);

                return false;
            });

        keycloakInstance.onTokenExpired = () => {
            updateToken();
        };

        return () => {
            keycloakInstance.onTokenExpired = undefined;
        };
    }, []);

    const updateToken = () => {
        return keycloakInstance
            .updateToken(30)
            .then(() => {
                setKeycloakToken(keycloakInstance.token);
            })
            .catch((error) => {
                console.error('Failed to update token', error);
            });
    };

    const logout = () => {
        keycloakInstance.logout();
        setKeycloakToken(null);
        setInitialized(false);
        keycloakInitPromise = null;
    };

    const isAuthenticated = () => !!keycloakInstance.token && !!keycloakInstance.authenticated;

    if (
        !providerValueRef.current ||
        providerValueRef.current.initialized !== initialized ||
        providerValueRef.current.keycloak !== keycloakInstance
    ) {
        providerValueRef.current = {
            initialized,
            keycloak: keycloakInstance,
            updateToken,
            logout,
            isAuthenticated,
        };
    }

    if (!initialized) {
        return <LoadingSplash />;
    }

    return <KeycloakContext.Provider value={providerValueRef.current!}>{children}</KeycloakContext.Provider>;
};
