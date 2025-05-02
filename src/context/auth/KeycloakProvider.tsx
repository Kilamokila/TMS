import React, { useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import { KeycloakContext } from './KeycloakContext';
import { API_URL, KEYCLOAK_CONFIG } from '@constants/environment';
import { TKeycloakToken } from './types/types';

const initOptions: Keycloak.KeycloakConfig = {
    url: KEYCLOAK_CONFIG.URL,
    realm: KEYCLOAK_CONFIG.REALM,
    clientId: KEYCLOAK_CONFIG.CLIENT_ID,
};

const keycloak = new Keycloak(initOptions);

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

    useEffect(() => {
        keycloak
            .init({
                checkLoginIframe: false,
                pkceMethod: 'S256',
                onLoad: 'login-required',
                redirectUri: `${API_URL}/projects`,
            })
            .then((authenticated) => {
                if (authenticated) {
                    setKeycloakToken(keycloak.token);
                    setInitialized(true);
                }
            })
            .catch((error) => {
                console.error('Failed to initialize Keycloak', error);
            });

        keycloak.onTokenExpired = () => {
            updateToken();
        };

        return () => {
            keycloak.onTokenExpired = undefined;
        };
    }, []);

    const updateToken = () => {
        return keycloak
            .updateToken(30)
            .then(() => {
                setKeycloakToken(keycloak.token);
            })
            .catch((error) => {
                console.error('Failed to update token', error);
            });
    };

    const logout = () => {
        keycloak.logout();
        setKeycloakToken(null);
        setInitialized(false);
    };

    const isAuthenticated = () => !!getKeycloakToken();

    const providerValue = {
        initialized,
        keycloak,
        updateToken,
        logout,
        isAuthenticated,
    };

    return <KeycloakContext.Provider value={providerValue}>{children}</KeycloakContext.Provider>;
};
