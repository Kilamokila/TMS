import type Keycloak from 'keycloak-js';

export type TKeycloakToken = string | null | undefined;

export interface IKeycloakContextProps {
    initialized: boolean;
    keycloak?: Keycloak;
    getAccessToken: () => TKeycloakToken;
    setAccessToken: (token: TKeycloakToken) => void;
    updateToken: () => Promise<void>;
    logout: () => void;
    isAuthenticated: () => boolean;
}
