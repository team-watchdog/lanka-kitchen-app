import { FunctionComponent, ReactNode } from "react";

interface TagProps{
    type: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
    color?: string;
    children: ReactNode;
}

export const Tag: FunctionComponent<TagProps> = (props) => {
    const { type, color, children } = props;

    return (
        <span>
            {children}
        </span>
    )
}