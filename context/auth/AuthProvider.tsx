import { FC, useReducer, useEffect, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';


import axios from 'axios';


import { IUser } from '@/interfaces/user';
import { authReducer } from './authReducer';
import { AuthContext } from './AuthContext';



export interface AuthState {
    children?: React.ReactNode;
    isLoggedIn: boolean;
    user?: IUser;
}

type Props = { 
    children?: React.ReactNode;
};

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}

export const AuthProvider:FC<PropsWithChildren> =  ({ children }: Props)=> {

    const [state, dispatch] = useReducer( authReducer, AUTH_INITIAL_STATE );
    const { data, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        
        if ( status === 'authenticated' ) {
            //console.log({user: data?.user});
            dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
        }
    
    }, [ status, data ])

    const loginUser = async(user:string, password: string ): Promise<boolean> => {

        try {
            const user: IUser = {
                name: 'Jorge',
                email: 'jorge.castillo',
                phone: '947210811',
                role: 'admin'
            }
            dispatch({ type: '[Auth] - Login', payload: user });
            return true;
        } catch (error) {
            return false;
        }

    }


    // const registerUser = async( name: string, email: string, password: string ): Promise<{hasError: boolean; message?: string}> => {
    //     try {

    //         dispatch({ type: '[Auth] - Login', payload: user });
    //         return {
    //             hasError: false
    //         }

    //     } catch (error) {
    //         if ( axios.isAxiosError(error) ) {
    //             return {
    //                 hasError: true,
    //                 message: error.response?.data.message
    //             }
    //         }

    //         return {
    //             hasError: true,
    //             message: 'No se pudo crear el usuario - intente de nuevo'
    //         }
    //     }
    // }


    const logout = () => {

        signOut();
        // router.reload();
        // Cookies.remove('token');
    }



    return (
        <AuthContext.Provider value={{
            ...state,

            // Methods
            loginUser,
            //registerUser,
            logout,
        }}>
            { children }
        </AuthContext.Provider>
    )
};