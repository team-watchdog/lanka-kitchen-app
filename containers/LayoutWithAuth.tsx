import { FunctionComponent, ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import {
    ApolloProvider,
} from "@apollo/client";

// hooks
import { useAuth } from "../lib/auth";

// client
import { getClientWithAuth } from "../api/clientWithAuth";

// containers
import { Header } from "./Header";

interface LayoutWithAuthProps{
    children: ReactNode | ReactNode[];
}

const LayoutWithAuth: FunctionComponent<LayoutWithAuthProps> = ({ children }) => {
    const { token, account, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
       if (!loading && !account) router.push("/auth/signin");
    }, [ account, loading ]);

    const client = getClientWithAuth(token);

    if (loading) {
        return (
            <div>Loading</div>
        )
    }

    return (
        <ApolloProvider client={client}>
            <Header />
            <div>
                {children}
            </div>
        </ApolloProvider>
    )
}

export default LayoutWithAuth;