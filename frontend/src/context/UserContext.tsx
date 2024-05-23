import { createContext, useState, useEffect } from "react";

export const usercontext = createContext<{ user: any; setUser: any }>({
    user: null,
    setUser: () => {},
});

function ContextProvider({ children }: { children: any }) {
    // Remove the unused variable declaration of 'any'
    const [user, setUser] = useState(null);

    return (
        <usercontext.Provider value={{ user, setUser }}>
            {children}
        </usercontext.Provider>
    );
}

export default ContextProvider;
