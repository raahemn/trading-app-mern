import { createContext, useState, useEffect } from "react";

export const tradecontext = createContext<{ tradeId: any; setTradeId: any, same_user:any, setSameUser:any, tradePosterId: any, setTradePosterId:any }>({
    tradeId: null,
    setTradeId: () => {},
    same_user:false,
    setSameUser: () => {},
    tradePosterId: null,
    setTradePosterId: () => {},
});

function TradeProvider({ children }: { children: any }) {
    // Remove the unused variable declaration of 'any'
    const [tradeId, setTradeId] = useState(null);
    const [same_user, setSameUser] = useState(false);
    const [tradePosterId, setTradePosterId] = useState(null);

    return (
        <tradecontext.Provider value={{ tradeId, setTradeId, same_user, setSameUser, tradePosterId, setTradePosterId }}>
            {children}
        </tradecontext.Provider>
    );
}

export default TradeProvider;
