import { FunctionComponent } from "react";

import { SelectValue } from "./types";

interface CheckboxItemProps{
    name?: string;
    value?: boolean;
    option: SelectValue;
    onChange: (value: boolean) => void;
}

export const CheckboxItem: FunctionComponent<CheckboxItemProps> = (props) => {
    const { name, value, option, onChange } = props;

    let checkboxId = "";

    if (name) checkboxId = `${name}-`;
    checkboxId = `${checkboxId}${option.value}`;

    return (
        <div className="flex gap-2 items-center justify-start flex-1">
            <input 
                id={checkboxId} 
                name={checkboxId} 
                type="checkbox" 
                checked={value}
                className="border accent-primary-color w-6 h-6"
                onChange={(e) => {
                    onChange(e.target.checked);
                }}
            />
            <label htmlFor={checkboxId} className="text-lg flex-1">
                {option.label}
            </label>
        </div>
    )
}