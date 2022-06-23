import { FunctionComponent } from "react";
import Link from "next/link";

import { useAuth } from "../lib/auth";

export const Header: FunctionComponent = () => {
    const { account, loading } = useAuth();

    return (
        <header
            className="bg-brand-primary h-3 w-full"
        >
            <div className="py-2 flex">
                {!loading && account ? (
                    <ul>
                        <li><Link href="/team"><a>Team</a></Link> </li>
                        <li><Link href="/auth/signout"><a>Sign Out</a></Link> </li>
                    </ul>
                ) : null}
            </div>
        </header>
    )
}