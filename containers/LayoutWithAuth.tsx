import { FunctionComponent, ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import {
    ApolloProvider,
} from "@apollo/client";
import { ToastContainer } from 'react-toastify';

// hooks
import { useAuth } from "../lib/auth";

// client
import { getClientWithAuth } from "../api/clientWithAuth";

// containers
import { Header } from "./Header";

// styles
import 'react-toastify/dist/ReactToastify.css';

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
            <div>
                {children}
            </div>
            <ToastContainer />
        </ApolloProvider>
    )
}

export default LayoutWithAuth;