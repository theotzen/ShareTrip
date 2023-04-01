import { createContext, ReactElement } from 'react';
import { UserResponseSchema } from '../../apiTypes';

export type UserContextProps = {
    user?: UserResponseSchema;
};

export const UserContext = createContext<UserContextProps>({ user: undefined });

export type UserManagerProps = {
    user?: UserResponseSchema;
    children: ReactElement;
};

const UserManager: React.FC<UserManagerProps> = (props) => {
    return (
        <UserContext.Provider
            value={{
                user: props.user,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};

export default UserManager;
