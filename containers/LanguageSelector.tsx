import { FunctionComponent, useContext } from "react";

import { Select } from "../components/Select";

// hooks
import { Language, LanguageContext } from "../localize";

export const LanguageSelector: FunctionComponent = () => {
    const { language, setLanguage } = useContext(LanguageContext);

    return (
        <div className="w-[80]px">
            <Select 
                value={language}
                onChange={(value) => {
                    setLanguage(value as Language);
                }}
                options={[
                    {
                        label: "English",
                        value: "en" as Language,
                    },
                    {
                        label: "සිංහල",
                        value: "si" as Language,
                    },
                    {
                        label: "தமிழ்",
                        value: "ta" as Language,
                    },
                ]}
            />
        </div>
    )
};