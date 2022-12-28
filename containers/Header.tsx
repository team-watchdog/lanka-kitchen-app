import { FunctionComponent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useContext } from "react";

import { useAuth } from "../lib/auth";

// localized
import { retrieveLocalizedString, LanguageContext } from "../localize";

// assets
import logo from '../public/logo.png';

import styles from '../styles/Home.module.css';

// components
import { LanguageSelector } from "./LanguageSelector";
import Button from "../components/Button";

const ONBOARDING_CALL_LINK = process.env.NEXT_PUBLIC_ONBOARDING_CALL_LINK ?? "";
const WHATSAPP_LINK = process.env.NEXT_PUBLIC_WHATSAPP_LINK ?? "";

export const Header: FunctionComponent = () => {
    const { account, organization, loading } = useAuth();
    const { language } = useContext(LanguageContext);

    return (
        <div className="sticky top-0 w-full z-10">
            {organization && organization.approved === false && (
                <div className="bg-amber-400 w-full">
                    <div className={styles.container} style={{ width: "100%" }}>
                        <div className="flex justify-between py-2">
                            <div>
                                <p className="font-bold">{retrieveLocalizedString(language, "OrganizationNotApproved")}</p>
                                <span> {retrieveLocalizedString(language, "OrganizationNotApprovedCallToAction")}</span>
                            </div>
                            <div className="flex justify-end gap-1">
                                <Button 
                                    type="secondary"
                                    onMouseDown={() => {
                                        window.open(ONBOARDING_CALL_LINK, "_blank");
                                    }}
                                >{retrieveLocalizedString(language, "OrganizationNotApprovedCallToActionLink")}</Button>
                                <Button 
                                    type="default"
                                    onMouseDown={() => {
                                        window.open(WHATSAPP_LINK, "_blank");
                                    }}
                                >{retrieveLocalizedString(language, "ContactUs")}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div></div>
            <header
                className="bg-brand-primary w-full"
            >
                <div className={styles.container} style={{ width: "100%" }}>
                    <div className="py-2 flex w-full justify-between items-center">
                        <div className="w-[160px] h-fit overflow-hidden">
                            <a className="cursor-pointer"><Link href="/"><Image src={logo} layout="responsive" /></Link></a>
                        </div>
                        {!loading ?
                            (account ? (
                                <ul className="flex-1 flex justify-end gap-4 font-semibold items-center">
                                    <LanguageSelector />
                                    <li><Link href="/"><a className="text-white">Directory</a></Link></li>
                                    <li><Link href="/requests"><a className="text-white">Requests</a></Link> </li>
                                    {/*<li><Link href="/pledges"><a className="text-white">Pledges</a></Link> </li>*/}
                                    {/*<li><Link href="/team"><a className="text-white">Team</a></Link> </li>*/}
                                    <li><Link href="/organization"><a className="text-white">My Organization</a></Link> </li>
                                    <li><Link href="/auth/signout"><a className="text-white">Sign Out</a></Link> </li>
                                </ul>
                            ) : (
                                <ul className="flex-1 flex justify-end gap-4 font-semibold items-center">
                                    <LanguageSelector />
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
        </div>
    )
}