import { useState, useEffect } from "react";

// types
import { Account } from "../types/account.type";
import { Organization } from "../types/organization.type";

import { getTokenCookie } from "./auth-cookies";
import { getClientWithAuth } from "../api/clientWithAuth";

// queries
import { AccountQueries } from "../queries/account.queries";

export const useAuth = () => {
    const [ account, setAccount] = useState<Partial<Account> | null>(null);
    const [ organization, setOrganization ] = useState<Partial<Organization> | null>(null);
    const [ organizationId, setOrganizationId ] = useState<number | null>(null);
    const [ loading, setLoading ] = useState(true);

    const token = getTokenCookie();

    const loadAccount = async (token: string) => {
        const client = getClientWithAuth(token);
            
        try {
            const resp = await client.query({
                query: AccountQueries.getMe,
            });
            
            setOrganization(resp.data.me.organization);
            setOrganizationId(resp.data.me.organization.id);
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
    }, [token]);

    if (!token || !account) {
        return {
            token: null,
            account: null,
            organizationId,
            loading,
        }
    }

    return {
        token,
        account,
        organization,
        organizationId,
    };
}