import React from 'react';
import { IKeycloakContextProps } from './types/types';

export const KeycloakContext = React.createContext<IKeycloakContextProps | undefined>(undefined);
