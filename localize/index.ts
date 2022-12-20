import { useState, useEffect } from "react";
import Cookies from 'js-cookie';

import { LocalizedStrings } from "./config";

export type Language = "en" | "si" | "ta";

const CookieHelpers = {
    KEY: 'watchdog-foodbank-language',
    MAX_AGE: 60 * 60 * 24 * 30, // 30 days
    setLocaleCookie(token: string) {
        Cookies.set(this.KEY, token, {
            expires: this.MAX_AGE,
        });
    },
    removeLocaleCookie() {
        Cookies.remove(this.KEY);
    },
    getLocaleCookie() {
        return Cookies.get(this.KEY);
    }
}

const getKeyLocalizedString = (key: string, language: Language) => {
    if (LocalizedStrings[key]) {
        if (LocalizedStrings[key][language]) return LocalizedStrings[key][language];
        if (LocalizedStrings[key]["en"]) return LocalizedStrings[key]["en"];
    }

    return "";
}

export const useLocale = () => {
    const tmp = CookieHelpers.getLocaleCookie();
    const [language, setLanguage] = useState<Language>(tmp as Language?? "en");

    const getLocalizedString = (key: string): string => {
        return getKeyLocalizedString(key, language);
    }

    useEffect(() => {
        const tmp = CookieHelpers.getLocaleCookie();
        if (tmp) {
            setLanguage(tmp as Language);
        }
    }, []);

    useEffect(() => {
        CookieHelpers.setLocaleCookie(language);
    }, [language]);

    return { language, setLanguage, getLocalizedString }
}