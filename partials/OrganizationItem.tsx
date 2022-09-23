import { FunctionComponent } from "react";
import { LocationMarkerIcon } from "@heroicons/react/solid";
import { Organization } from "../types/organization.type";

interface OrganizationItemProps{
    organization: Organization;
}

export const OrganizationItem: FunctionComponent<OrganizationItemProps> = (props) => {
    const { organization } = props;

    return (
        <div className="py-2 px-4 mb-1 divide-y-1 divide-y-gray-400 hover:bg-white rounded-md">
            <a href=""><h3 className="text-md font-semibold">{organization.name}</h3></a>
            <a href="" className="flex items-center"><LocationMarkerIcon className="w-4 h-4 font-bold mr-2"/> CMC, Colombo, Sri Lanka</a>
            <p className="text-sm py-2">{organization.summary ? organization.summary : "—"}</p>
            {organization.assistanceTypes && organization.assistanceTypes.length > 0 ? (
                <div className="py-2 flex gap-1">
                    {organization.assistanceTypes?.map((type, i) => (
                        <span className="p-2 bg-teal-800 text-white rounded-md text-sm" key={i}>{type}</span>
                    ))}
                </div>
            ) : null}
        </div>
    )
}