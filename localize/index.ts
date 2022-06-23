import { LocalizedStrings } from "./config";

export const getLocalizedString = (key: string, language: string) => {
    if (LocalizedStrings[key]) {
        if (LocalizedStrings[key][language]) return LocalizedStrings[key][language];
        if (LocalizedStrings[key]["en"]) return LocalizedStrings[key]["en"];
    }

    return "";
}