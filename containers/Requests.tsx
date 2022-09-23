import { FunctionComponent, useState } from "react";
import { PlusSmIcon, HandIcon } from "@heroicons/react/solid";
import { gql, useQuery } from "@apollo/client";
import { useFormik } from "formik";

// components
import { InputText, InputNumber, CheckboxItem } from "../components/Input";
import { Select } from "../components/Select";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { Loading } from "../components/Loading";

// partials
import { RequestItem } from "../partials/RequestItem";
import { VolunteerRequestItem } from "../partials/VolunteerRequestItem";

// containers
import { RequestFormModal } from "../containers/RequestForm";
import { VolunteerRequestFormModal } from "./VolunteerRequestForm";

// types
import { Location } from "../types/location.type";
import { RequestInput, RequestStatus, RequestType, Unit, Request } from "../types/request.type";
import { VolunteerRequest, VolunteerRequestInput, VolunteerRequestStatus } from "../types/volunteerRequest.type";

// queries
import { OrganizationQueries } from "../queries/organization.queries";

const Queries = {
    GET_ORGANIZATION: gql`
        query GetOrganization{
            me{
                organization{
                    id
                    locations{
                        placeId
                        formattedAddress
                    }
                }
            }
        }
    `,
    GET_REQUESTS: gql`
        query GetOrganizationRequests($id: Int!, $status: RequestStatus){
            getOrganizationRequests(id: $id, status: $status) {
                id
                itemName
                unit
                placeId
                quantity
                status
                requestType
                updatedAt
            }
        }
    `,
    GET_VOLUNTEER_REQUESTS: gql`
        query GetOrganizationVolunteerRequests($id: Int!, $status: VolunteerRequestStatus){
            getOrganizationVolunteerRequests(id: $id, status: $status) {
                id
                title
                description
                placeId
                skills
                status
                updatedAt
            }
        }
    `,
}

interface RequestsProps{
    organizationId: number;
}

interface RequestResponse{
    getOrganizationRequests: Request[];
}

const Requests: FunctionComponent<RequestsProps> = (props: RequestsProps) => {
    const { organizationId } = props;

    const [ searchTerm, setSearchTerm ] = useState<string>("");
    const [ placeId, setPlaceId ] = useState<string | null>(null);
    const [ showFulfilledRequests, setshowFulfilledRequests ] = useState(false);

    const { data: organizationData, loading: loadingOrganization } = useQuery(OrganizationQueries.GET_ORGANIZATION);
    const { data, loading: loadingRequests, refetch } = useQuery<RequestResponse>(Queries.GET_REQUESTS, {
        variables: {
            id: organizationId,
            status: !showFulfilledRequests ? "Active" : undefined,
        }
    });

    const { data: volunteerData, loading: loadingVolunteer, refetch: refetchVolunteerRequests } = useQuery(Queries.GET_VOLUNTEER_REQUESTS, {
        variables: {
            id: organizationId,
            status: !showFulfilledRequests ? "Active" : undefined,
        }
    });

    const [ showItemRequest, setShowItemRequest ] = useState(false);
    const [ showVolunteerRequest, setShowVolunteerRequest ] = useState(false);

    const requestItems = data?.getOrganizationRequests.filter((request) => {
        let match = true;
        
        match = request.itemName.toLowerCase().includes(searchTerm.toLowerCase());
        if (placeId) match = match && request.placeId === placeId;

        return match;
    }) ?? [];

    const volunteerRequestItems = volunteerData?.getOrganizationVolunteerRequests.filter((request: VolunteerRequest) => {
        let match = true;
    
        match = request.title.toLowerCase().includes(searchTerm.toLowerCase()) || request.description.toLowerCase().includes(searchTerm.toLowerCase());
        if (placeId) match = match && request.placeId === placeId;

        return match;
    }) ?? [];

    const rationItems = requestItems.filter((request: Request) => request.requestType === RequestType.Ration);
    const equipmentItems = requestItems.filter((request: Request) => request.requestType === RequestType.Equipment);

    if (loadingRequests || loadingOrganization || loadingVolunteer) return <Loading />;

    return (
        <div className="pb-4">
            <div className="pb-1 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Requests</h2>
                <div className="flex gap-2 items-center">
                    <div>
                        <CheckboxItem 
                            value={showFulfilledRequests} 
                            onChange={(value) => {
                                setshowFulfilledRequests(value);
                            }}
                            option={{
                                label: "Show Fulfilled Requests",
                                value: "fulfilled",
                            }} 
                        />
                    </div>
                    <Button type="primary" onMouseDown={() => {
                        setShowItemRequest(true);
                    }}><PlusSmIcon className="w-6 h-6" /> Item Request</Button>
                    <Button type="default" onMouseDown={() => {
                        setShowVolunteerRequest(true);
                    }}>
                        <HandIcon className="w-6 h-6" /> Volunteer Request
                    </Button>
                </div>
            </div>
            <div className="py-4 grid grid-cols-5 gap-2">
                <div className="col-span-3 flex">
                    <InputText 
                        placeholder="Search for requests"
                        value={searchTerm}
                        onChange={(value) => {
                            setSearchTerm(value);
                        }}
                    />
                </div>
                <div className="col-span-2 flex">
                    <Select 
                        options={[
                            {
                                label: "General",
                                value: null,
                            },
                            ...organizationData.me.organization.locations.map((location: Location) => ({
                                label: location.formattedAddress,
                                value: location.placeId,
                            }))
                        ]}
                        value={placeId}
                        onChange={(value) => {
                            setPlaceId(value as string);
                        }}
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 p-4 bg-indigo-100 rounded-md">
                    <h4 className="text-lg font-extrabold text-slate-500 mb-2">Rations</h4>
                    <div className="flex flex-col gap-2">
                        {rationItems?.map((request: Request, i) => (
                            <RequestItem 
                                key={i} 
                                request={request} 
                                locations={organizationData?.me?.organization?.locations ?? []}
                                refetch={refetch}
                            />
                        ))}
                    </div>
                </div>
                <div className="col-span-1 p-4 bg-sky-100 rounded-md">
                    <h4 className="text-lg font-extrabold text-slate-500 mb-2">Equipment</h4>
                    <div className="flex flex-col gap-2">
                        {equipmentItems?.map((request: Request, i) => (
                            <RequestItem 
                                key={i} 
                                request={request} 
                                locations={organizationData?.me?.organization?.locations ?? []}
                                refetch={() => {
                                    refetch({
                                        id: organizationId,
                                        status: !showFulfilledRequests ? "Active" : undefined,
                                    });
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div className="col-span-1 p-4 bg-violet-100 rounded-md">
                    <h4 className="text-lg font-extrabold text-slate-500 mb-2">Volunteers</h4>
                    <div className="flex flex-col gap-2">
                        {volunteerRequestItems ? volunteerRequestItems.map((request: VolunteerRequest, i: number) => (
                            <VolunteerRequestItem 
                                key={i}
                                request={request}
                                locations={organizationData?.me?.organization?.locations ?? []}
                                refetch={() => {
                                    refetchVolunteerRequests({
                                        id: organizationId,
                                        status: !showFulfilledRequests ? "Active" : undefined,
                                    });
                                }}
                            />
                        )) : null}
                    </div>
                </div>
            </div>
            {showItemRequest ? (
                <RequestFormModal 
                    visible={showItemRequest}
                    onClose={() => {
                        setShowItemRequest(false);

                        refetch({
                            id: organizationId,
                            status: !showFulfilledRequests ? "Active" : undefined,
                        });
                    }}
                />
            ) : null}
            {showVolunteerRequest ? (
                <VolunteerRequestFormModal
                    visible={showVolunteerRequest}
                    onClose={() => {
                        setShowVolunteerRequest(false);
                        
                        refetchVolunteerRequests({
                            id: organizationId,
                            status: !showFulfilledRequests ? "Active" : undefined,
                        });
                    }}
                />
            ) : null}
        </div>
    )
}

export default Requests;