import { createContext } from "react";
import Cookies from 'js-cookie';

import { LocaleStringMap } from "./config";

export type Language = "en" | "si" | "ta";

interface LanguageContextState {
    language: Language;
    setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextState>({ language: "en", setLanguage: () => {} });

export const CookieHelpers = {
    KEY: 'watchdog-foodbank-language',
    MAX_AGE: 60 * 60 * 24 * 30, // 30 days
    setLocaleCookie(language: string) {
        Cookies.set(this.KEY, language, {
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

export const retrieveLocalizedString = (language: Language, key: string): string => {
    if (LocaleStringMap[language]) {
        if (LocaleStringMap[language][key]) return LocaleStringMap[language][key];
    }

    if (LocaleStringMap["en"] && LocaleStringMap["en"][key]) return LocaleStringMap["en"][key];

    return "";
}