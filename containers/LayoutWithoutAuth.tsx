import { FunctionComponent, ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import {
    ApolloProvider,
    ApolloClient,
    InMemoryCache,
} from "@apollo/client";
import { ToastContainer } from 'react-toastify';

// hooks
import { useAuth } from "../lib/auth";

// containers
import { Header } from "./Header";

// styles
import 'react-toastify/dist/ReactToastify.css';

interface LayoutWithoutAuthProps{
    noRedirect?: boolean;
    children: ReactNode | ReactNode[];
}

const LayoutWithoutAuth: FunctionComponent<LayoutWithoutAuthProps> = ({ noRedirect, children }) => {
    const { account, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (account && !noRedirect) router.push("/");
    }, [ account ]);

    const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_API_URL,
        cache: new InMemoryCache(),
    });

    if (loading) {
        return (
            <div>Loading</div>
        )
    }

    return (
        <ApolloProvider client={client}>
            <div>
                {children}
            </div>
            <ToastContainer />
        </ApolloProvider>
    )
}

export default LayoutWithoutAuth;