import { useContext } from 'react';
import { KeycloakContext } from './KeycloakContext';
import { IKeycloakContextProps } from './types/KeycloakContextPropsInterface';

/**
 * Хук для получения контекста keycloak.
 */
export const useKeycloak = (): IKeycloakContextProps => {
    const context = useContext(KeycloakContext);

    if (!context.keycloak) {
        throw new Error('keycloak client has not been assigned to KeycloakProvider');
    }

    const { keycloak, initialized } = context;

    return {
        initialized,
        keycloak,
    };
};
