import Image from 'next/image';
import { useRouter } from "next/router";
import { LinkIcon, LocationMarkerIcon } from "@heroicons/react/solid";
import { gql, useQuery, useMutation, ApolloError } from "@apollo/client";

// components
import { ToggleArea } from "../components/Disclosure";
import { SummaryLine } from "../components/SummaryLine";
import Button from "../components/Button";
import { Tabs } from "../components/Tabs";

// styles
import styles from '../styles/Home.module.css'

// containers
import Requests from "./Requests";
import Pledges from "./Pledges";
import { Loading } from '../components/Loading';

// types
import { Organization } from "../types/organization.type";
import { FunctionComponent } from 'react';

interface GetOrganizationData{
    getOrganization: Organization;
}

const Queries = {
    GET_ORGANIZATION_DETAILS: gql`
        query GetOrganization($id: Int!) {
            getOrganization(id: $id) {
                id
                name
                summary
                description
                assistanceTypes
                assistanceFrequency
                peopleReached
                profileImageUrl
                locations{
                    placeId
                    formattedAddress
                    district
                    province
                    geo{
                        lat
                        lon
                    }
                }
                bankName
                accountNumber
                accountName
                accountType
                branchName
                notes
                phoneNumbers
                email
                website
                instagram
                facebook
                twitter
                paymentLink
            }
        }
    `,
}

interface FullOrganizationProps{
    organizationId: number;
    editAccess?: boolean;
}

const FullOrganization: FunctionComponent<FullOrganizationProps> = (props: FullOrganizationProps) => {
    const { organizationId, editAccess } = props;

    const { push } = useRouter();

    const { data, loading, refetch } = useQuery<GetOrganizationData, { id: number }>(Queries.GET_ORGANIZATION_DETAILS, {
        variables: {
            id: parseInt(`${organizationId}`),
        }
    });

    if (loading) return <Loading />;
    if (!data) return null;

    const { getOrganization: organization } = data;

    const OrganizationDetails = () => (
        <div className="grid grid-cols-3 gap-8">
            <div className="col-span-3 gap-6 flex flex-col">
                <div>
                    <SummaryLine label="Name">
                        <p>{organization.name}</p>
                    </SummaryLine>
                    <SummaryLine label="Description">                                        
                        <p>{organization.description}</p>
                    </SummaryLine>
                    <SummaryLine label="Locations">
                        <div className="flex flex-col">
                            <ul className="list-disc list-inside leading-7">
                                {organization.locations ? organization.locations.map((location, index) => (
                                    <li key={index}><span className="inline-flex items-center"><a href="">{location.formattedAddress}</a></span></li>
                                )) : "—"}
                            </ul>
                        </div>
                    </SummaryLine>
                    <SummaryLine label="Types of Assistance">
                        <div className="flex gap-1 flex-wrap">
                            {organization.assistanceTypes ? organization.assistanceTypes.map((type, index) => (
                                <span className="p-2 bg-teal-800 text-white rounded-md text-sm" key={index}>{type}</span>
                            )) : "—"}
                        </div>
                    </SummaryLine>
                    <SummaryLine label="How often is this service provided">
                        {organization.assistanceFrequency ? organization.assistanceFrequency : "—"}
                    </SummaryLine>
                    <SummaryLine label="How many people are reached">
                        {organization.peopleReached ? organization.peopleReached : "—"}
                    </SummaryLine>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4">Contact Details</h3>
                    <SummaryLine label="Phone">
                        <ul className="list-disc list-inside leading-7">
                            {organization.phoneNumbers ? organization.phoneNumbers.map((phone, i) => (
                                <li><a href="">{phone}</a></li>
                            )) : "—"}
                        </ul>
                    </SummaryLine>
                    <SummaryLine label="Email">
                        <a href="">{organization.email ? organization.email : "—"}</a>
                    </SummaryLine>
                    <SummaryLine label="Social Links">
                        <ul className="list-disc list-inside leading-7">
                            {organization.website ? <li><a href={organization.website}>Website</a></li> : null}
                            {organization.twitter ? <li><a href={organization.twitter}>Twitter</a></li> : null}
                            {organization.instagram ? <li><a href={organization.instagram}>Instagram</a></li> : null}
                            {organization.facebook ? <li><a href={organization.facebook}>Instagram</a></li> : null}
                            {organization.paymentLink ? <li><a href={organization.paymentLink}>Instagram</a></li> : null}
                        </ul>
                    </SummaryLine>
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-4">Bank Details</h3>
                    <SummaryLine label="Account Name">
                        {organization.accountName ? organization.accountName : "—"}
                    </SummaryLine>
                    <SummaryLine label="Bank Name">
                        {organization.bankName ? organization.bankName : "—"}
                    </SummaryLine>
                    <SummaryLine label="Branch">
                        {organization.branchName ? organization.branchName : "—"}
                    </SummaryLine>
                    <SummaryLine label="Account Number">
                        {organization.accountNumber ? organization.accountNumber : "—"}
                    </SummaryLine>
                    <SummaryLine label="Account Type">
                        {organization.accountType ? organization.accountType : "—"}
                    </SummaryLine>
                    <SummaryLine label="Notes">
                        <p>{organization.notes ? organization.notes : "—"}</p>
                    </SummaryLine>
                </div>
            </div>
                {/*
            <div className="col-span-1 px-4 pt-4 pb-6 bg-blue-50 rounded-md h-fit">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-lg">Reporting</h5>
                        <Button type="default" onMouseDown={() => {}}>New Report</Button>
                    </div>
                    <ToggleArea
                        title="Financial Reports May 2022"
                        subtitle="2012 July 01"
                    >
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus convallis mi massa.</p>
                        <div className="py-2 flex flex-wrap gap-1">
                            <span className="py-2 px-4 bg-white border border-gray-200 rounded-md"><a href="">Bank Statements March 2020</a></span>
                            <span className="py-2 px-4 bg-white border border-gray-200 rounded-md"><a href="">Equipment Purchase Invoice</a></span>
                        </div>
                    </ToggleArea>
                </div>
            </div>
                */}
        </div>
    )

    return (
        <div className={styles.container} style={{ width: "100%" }}>
            <div className="py-2">
                <div className="p-4 bg-slate-100 rounded-md flex gap-6">
                    <div className="h-[80px] w-[80px] rounded-[40px] overflow-hidden">
                        <Image
                            src={data.getOrganization.profileImageUrl ?? "/images/placeholder.png"}
                            alt="Logo Image"
                            width={400}
                            height={400}
                        />
                    </div>
                    <div className="flex-1 pr-4">
                        <h2 className="font-bold text-xl">{organization.name}</h2>
                        <div className="pt-2">
                            <p>{organization.summary}</p>
                        </div>
                        <div className="pt-2 flex gap-4">
                            {organization.website ? (
                                <a href={organization.website} target="__blank" className="flex items-center gap-1">
                                    <LinkIcon className="w-4 h-4 font-bold"/><span>{organization.website}</span>
                                </a>
                            ) : null}
                            <a 
                                href="" target="__blank" className="flex items-center gap-1"
                                onClick={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                <LocationMarkerIcon className="w-4 h-4 font-bold"/>
                                {organization.locations && organization.locations.length > 0 ? (
                                    <span>{organization.locations?.length > 0 ? "Multiple Locations" : organization.locations[0].formattedAddress}</span>
                                ) : (
                                    <span>—</span>
                                )}
                            </a>
                        </div>
                        <div className="flex gap-1 pt-4 flex-wrap">
                            {organization.assistanceTypes?.map((type, i) => (
                                <span className="p-2 bg-teal-800 text-white rounded-md text-sm" key={i}>{type}</span>
                            ))}
                        </div>
                    </div>
                    {editAccess ? (
                        <div>
                            <Button type="default" onMouseDown={() => {
                                push("/organization/edit");
                            }}>Edit</Button>
                        </div>
                    ) : null}
                </div>
                <div className="py-2 px-2 mt-4">
                    <Tabs 
                        tabs={[
                            {
                                title: "Details",
                                component: <OrganizationDetails />
                            },
                            {
                                title: "Requests",
                                component: (
                                    <Requests 
                                        organizationId={parseInt(`${organizationId}`)} 
                                        editAccess={editAccess}
                                    />
                                )
                            },
                            /*
                            {
                                title: "Pledges",
                                component: <Pledges />,
                            }
                            */
                        ]}
                    />
                </div>
            </div>
        </div>
    )
}

export default FullOrganization;