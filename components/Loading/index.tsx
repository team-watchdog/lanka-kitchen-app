import { FunctionComponent } from "react";
import { Oval } from "react-loader-spinner";

export const Loading: FunctionComponent = () => {
    return (
        <div className="w-full py-40 align-middle justify-center text-center flex">
            <Oval
                height="40"
                width="40"
                color="#244583"
                secondaryColor="#AEB6C3"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    )
}
