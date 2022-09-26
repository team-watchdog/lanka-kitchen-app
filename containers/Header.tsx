import { FunctionComponent } from "react";
import Link from "next/link";
import Image from "next/image";

import { useAuth } from "../lib/auth";

// assets
import logo from '../public/logo.svg';

import styles from '../styles/Home.module.css'

export const Header: FunctionComponent = () => {
    const { account, loading } = useAuth();

    return (
        <header
            className="bg-brand-primary w-full"
        >
            <div className={styles.container} style={{ width: "100%" }}>
                <div className="py-2 flex w-full justify-between items-center">
                    <div className="w-[180px] h-fit overflow-hidden">
                        <Image src={logo} layout="responsive" />
                    </div>
                    {!loading ?
                        (account ? (
                            <ul className="flex-1 flex justify-end gap-4 font-semibold">
                                <li><Link href="/"><a className="text-white">Directory</a></Link></li>
                                <li><Link href="/requests"><a className="text-white">Requests</a></Link> </li>
                                {/*<li><Link href="/pledges"><a className="text-white">Pledges</a></Link> </li>*/}
                                {/*<li><Link href="/team"><a className="text-white">Team</a></Link> </li>*/}
                                <li><Link href="/organization"><a className="text-white">My Organization</a></Link> </li>
                                <li><Link href="/auth/signout"><a className="text-white">Sign Out</a></Link> </li>
                            </ul>
                        ) : (
                            <ul className="flex-1 flex justify-end gap-4 font-semibold">
                                <li><Link href="/"><a className="text-white">Directory</a></Link></li>
                                <li><Link href="/auth/signin"><a className="text-yellow-400">Organization Sign In</a></Link></li>
                            </ul>
                        )):
                    (
                        null
                    )}
                </div>
            </div>
        </header>
    )
}