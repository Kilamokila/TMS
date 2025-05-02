import type Keycloak from 'keycloak-js';

export type TKeycloakToken = string | null | undefined;

export interface IKeycloakContextProps {
    initialized: boolean;
    keycloak?: Keycloak;
    updateToken: () => Promise<void>;
    logout: () => void;
    isAuthenticated: () => boolean;
}
