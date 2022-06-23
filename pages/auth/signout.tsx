import { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";

import { removeTokenCookie } from "../../lib/auth-cookies";

const SignOut: NextPage = () => {
    const router = useRouter();

    useEffect(() => {
        removeTokenCookie();
        router.push("/auth/signin");
    }, [])

    return null;
}

export default SignOut;