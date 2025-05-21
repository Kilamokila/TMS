import React, { useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import { useDispatch } from 'react-redux';

import { CLIENT_URL, KEYCLOAK_CONFIG } from '@constants/environment';
import { clearRoles, setRoles } from '@store/reducers/roles/actions';

import { KeycloakContext } from './KeycloakContext';
import { IAuthUser, TKeycloakToken } from './types/types';

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
    const dispatch = useDispatch();

    useEffect(() => {
        keycloak
            .init({
                checkLoginIframe: false,
                pkceMethod: 'S256',
                onLoad: 'check-sso',
                redirectUri: `${CLIENT_URL}/projects`,
            })
            .then((authenticated) => {
                setInitialized(true);

                if (authenticated) {
                    setKeycloakToken(keycloak.token);

                    keycloak.loadUserInfo().then((authData) => {
                        const { resource_access } = authData as IAuthUser;

                        if (resource_access?.TMS?.roles) {
                            dispatch(setRoles(resource_access.TMS.roles));
                        }
                    });
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
            dispatch(clearRoles());
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
