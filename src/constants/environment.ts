export const KEYCLOAK_CONFIG = {
    url: import.meta.env.VITE_KEYCLOAK_URL as string,
    realm: import.meta.env.VITE_KEYCLOAK_REALM as string,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string,
};

export const API_URL = import.meta.env.VITE_API_URL as string;
export const CLIENT_URL = import.meta.env.VITE_CLIENT_URL as string;
