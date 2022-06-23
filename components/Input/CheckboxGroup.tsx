import { FunctionComponent } from "react";

import { SelectValue } from "./types";
import { CheckboxItem } from "./CheckboxItem";

interface CheckboxGroupProps{
    options: SelectValue[];
    values: string[];
    onChange: (values: string[]) => void;
}

export const CheckboxGroup: FunctionComponent<CheckboxGroupProps> = (props) => {
    const { options } = props;

    return (
        <div className="flex gap-4 flex-col">
            {options.map((option, i) => (
                <CheckboxItem 
                    name="hello"
                    option={option}
                    onChange={(value) => {
                        console.log(value);
                    }}
                    key={i}
                />
            ))}
        </div>
    )
}