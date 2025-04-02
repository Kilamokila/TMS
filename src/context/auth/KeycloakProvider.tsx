import Keycloak from 'keycloak-js';
import React, { useEffect, useState } from 'react';
import { KeycloakContext as KeycloakAuthContext } from './KeycloakContext';

import { LocalStorageUtil } from '@services/storage';
import { EStorageKeys } from '@services/storage/storageKeys';
import { IKeycloakContextProps } from './types/KeycloakContextPropsInterface';
import { KEYCLOAK_CONFIG } from '@constants/environment';

const initOptions: Keycloak.KeycloakConfig = {
    url: KEYCLOAK_CONFIG.URL,
    realm: KEYCLOAK_CONFIG.REALM,
    clientId: KEYCLOAK_CONFIG.CLIENT_ID,
};

type TKeycloakProvider = React.FC<React.PropsWithChildren>;

/**
 * Функция для создания keycloak провайдера.
 * @param KeycloakContext Контекст keycloak.
 */
const createKeycloakProvider = (KeycloakContext: React.Context<IKeycloakContextProps>): TKeycloakProvider => {
    const keycloak = new Keycloak(initOptions);

    const KeycloakProvider: TKeycloakProvider = ({ children }) => {
        const [initialized, setInitialized] = useState<boolean>(false);

        useEffect(() => {
            const initialize = () => {
                keycloak
                    .init({
                        checkLoginIframe: false,
                    })
                    .then(() => {
                        setInitialized(true);

                        if (keycloak.token) {
                            LocalStorageUtil.setItem(EStorageKeys.TOKEN, keycloak.token);
                        }
                    })
                    .catch((error) => {
                        console.error('Failed to initialize Keycloak', error);
                        throw new Error(error);
                    });
            };

            initialize();
        }, []);

        keycloak.onTokenExpired = () => {
            keycloak
                .updateToken(320)
                .then((refreshed) => {
                    if (refreshed && keycloak.token) {
                        LocalStorageUtil.setItem(EStorageKeys.TOKEN, keycloak.token);
                    }
                })
                .catch(() => {
                    console.error('Failed to refresh token ' + new Date());
                });
        };

        keycloak.onAuthRefreshError = () => {
            keycloak.login();
        };

        keycloak.onAuthLogout = () => {
            LocalStorageUtil.removeItem(EStorageKeys.TOKEN);
        };

        const providerValue = React.useMemo(() => {
            return {
                initialized,
                keycloak,
            };
        }, [keycloak, initialized]);

        return <KeycloakContext.Provider value={providerValue}>{children}</KeycloakContext.Provider>;
    };

    return KeycloakProvider;
};

export const KeycloakProvider = createKeycloakProvider(KeycloakAuthContext);
