import { getCurrentUser } from "@/lib/appwrite";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface GlobalContextProps { 
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    user: any;
    setUser: (user: any) => void;
    isLoading: boolean;
}

const GlobalContext = createContext<GlobalContextProps>({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    user: null,
    setUser: () => {},
    isLoading: true
});

export const useGlobalContext = () => useContext(GlobalContext);

interface GlobalProviderProps {
    children: ReactNode;
}
 
export const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
        .then(res => {
            if (res) {
                setIsLoggedIn(true);
                setUser(res);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        })
        .catch(err => {
            console.error(err);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                setIsLoggedIn,
                user,
                setUser,
                isLoading
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};