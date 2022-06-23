import { FunctionComponent, ReactNode } from "react";

const commonClasses = [
    'py-2 px-4 rounded-md border',
    'font-semibold',
    'flex justify-between items-center gap-2',
];

const primaryClasses = [
    'bg-primary-color',
    'text-white',
];

const secondaryClasses = [
    'bg-secondary-color',
    'text-white',
];

const defaultClasses = [
    'bg-default-color',
    'text-white',
];


const dangerClasses = [
    'bg-danger-color',
    'text-white',
];

interface ButtonProps{
    onMouseDown: () => void;
    loading?: boolean;
    children: ReactNode | ReactNode[],
    type: "primary" | "secondary" | "default" | "danger";
}

const Button: FunctionComponent<ButtonProps> = (props) => {
    const { loading, type, children, onMouseDown } = props;

    let classes = commonClasses;

    if (type === "primary") classes = [ ...classes, ...primaryClasses ];
    if (type === "secondary") classes = [ ...classes, ...secondaryClasses ];
    if (type === "default") classes = [ ...classes, ...defaultClasses ];
    if (type === "danger") classes = [ ...classes, ...dangerClasses ];

    return (
        <button
            className={classes.join(" ")}
            onClick={(e) => {
                e.preventDefault();

                if (loading) return;
                onMouseDown();
            }}
        >
            {loading ? "Loading" : children}
        </button>
    )
}

export default Button;