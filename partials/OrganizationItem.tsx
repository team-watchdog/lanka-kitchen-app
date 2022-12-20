import { FunctionComponent, useState } from "react";
import { LocationMarkerIcon, ChevronUpIcon } from "@heroicons/react/solid";

import { Organization } from "../types/organization.type";
import Button from "../components/Button";
import Link from "next/link";

interface OrganizationItemProps{
    organization: Organization;
}

export const OrganizationItem: FunctionComponent<OrganizationItemProps> = (props) => {
    const { organization } = props;
    const [ open, setOpen ] = useState(false);

    return (
        <div className="py-4 mb-1 divide-y-1 divide-y-gray-400 hover:bg-slate-300 border-b border-b-gray-200">
            <div className="flex justify-between">
                <div>
                    <h3 className="text-md font-semibold">{organization.name}</h3>
                    <a href="" className="flex items-center"><LocationMarkerIcon className="w-4 h-4 font-bold mr-2"/> Multiple Locations</a>
                    {organization.assistanceTypes && organization.assistanceTypes.length > 0 ? (
                        <div className="py-2 flex gap-1">
                            {organization.assistanceTypes?.map((type, i) => (
                                <span className="p-2 bg-teal-800 text-white rounded-md text-sm" key={i}>{type}</span>
                            ))}
                        </div>
                    ) : null}
                </div>
                <a 
                    href=""
                    onClick={(e) => {
                        console.log(open);
                        setOpen(!open);
                        e.preventDefault();
                    }}
                >
                    <ChevronUpIcon 
                        className={`w-8 h-8 ${open ? "rotate-180 transform" : ""}`}
                    />
                </a>
            </div>
            {open ? (
                <div>
                    <div>
                        <p className="text-md py-2">{organization.summary ? organization.summary : "—"}</p>
                    </div>
                    {organization.locations && organization.locations.length > 1 ? (
                        <div>
                            <label className="font-semibold">Locations</label>
                            <ul className="list-disc list-inside leading-7 text-md">
                                {organization.locations.map((location, i) => (
                                    <li key={i}><a href="">{location.formattedAddress}</a></li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                    <div className="pt-4">
                        <Link href={`/organization/${organization.id}`}><a className="font-semibold">Learn More</a></Link>
                    </div>
                </div>
            ) : null}
        </div>
    )
}