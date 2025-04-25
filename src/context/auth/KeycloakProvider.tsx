import React, { useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import { KeycloakContext } from './KeycloakContext';
import { KEYCLOAK_CONFIG } from '@constants/environment';
import { TKeycloakToken } from './types/types';

const initOptions: Keycloak.KeycloakConfig = {
    url: KEYCLOAK_CONFIG.URL,
    realm: KEYCLOAK_CONFIG.REALM,
    clientId: KEYCLOAK_CONFIG.CLIENT_ID,
};

const keycloak = new Keycloak(initOptions);

export const KeycloakProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const tokenManager = (() => {
        let accessToken: TKeycloakToken = null;

        return {
            getAccessToken: () => accessToken,
            setAccessToken: (token: TKeycloakToken) => {
                accessToken = token;
            },
        };
    })();

    const [initialized, setInitialized] = useState<boolean>(false);

    useEffect(() => {
        keycloak
            .init({ checkLoginIframe: false })
            .then((authenticated) => {
                if (authenticated) {
                    tokenManager.setAccessToken(keycloak.token);
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
                tokenManager.setAccessToken(keycloak.token);
            })
            .catch((error) => {
                console.error('Failed to update token', error);
            });
    };

    const logout = () => {
        keycloak.logout();
        tokenManager.setAccessToken(null);
        setInitialized(false);
    };

    const isAuthenticated = () => !!tokenManager.getAccessToken();

    const providerValue = {
        initialized,
        keycloak,
        getAccessToken: tokenManager.getAccessToken,
        setAccessToken: tokenManager.setAccessToken,
        updateToken,
        logout,
        isAuthenticated,
    };

    return <KeycloakContext.Provider value={providerValue}>{children}</KeycloakContext.Provider>;
};
