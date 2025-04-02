import type Keycloak from 'keycloak-js';

export interface IKeycloakContextProps {
    keycloak?: Keycloak;
    initialized: boolean;
}
