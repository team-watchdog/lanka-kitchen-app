import { useState, useEffect } from "react";

import { Account } from "../types/account.type";
import { getTokenCookie } from "./auth-cookies";

import { getClientWithAuth } from "../api/clientWithAuth";

// queries
import { AccountQueries } from "../queries/account.queries";

export const useAuth = () => {
    const [account, setAccount] = useState<Partial<Account> | null>(null);
    const [loading, setLoading] = useState(true);

    const token = getTokenCookie();

    const loadAccount = async (token: string) => {
        const client = getClientWithAuth(token);
            
        try {
            const resp = await client.query({
                query: AccountQueries.getMe,
            });
            
            setAccount(resp.data.me);
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    }

    useEffect(() => {
        if (token) {
            loadAccount(token);
        } else {
            setLoading(false);
        }
    }, []);

    if (!token || !account) {
        return {
            token: null,
            account: null,
            loading,
        }
    }

    return {
        token,
        account,
    };
}