import { FunctionComponent, useState } from "react";
import { gql, useMutation, ApolloError } from "@apollo/client";
import { toast } from "react-toastify";
import { CheckCircleIcon, InformationCircleIcon, PencilIcon, TrashIcon, CheckIcon } from "@heroicons/react/solid";
import moment from "moment";

// components
import Button from "../components/Button";
import Modal from "../components/Modal";
import { SummaryLine } from "../components/SummaryLine";
import { VolunteerRequestForm } from "../containers/VolunteerRequestForm";

// types
import { VolunteerRequest, VolunteerRequestStatus } from "../types/volunteerRequest.type";
import { Location } from "../types/location.type";

const Queries = {
    FULFILL_REQUEST: gql`
        mutation FulfillVolunteerRequest($id: Int!){
            fulfillVolunteerRequest(id: $id)
        }
    `,
    DELETE_VOLUNTEER_REQUEST: gql`
        mutation DeleteVolunteerRequest($id: Int!) {
            deleteVolunteerRequest(id: $id)
        }
    `,
}

interface VolunteerRequestItemProps{
    request: VolunteerRequest;
    locations: Location[];
    refetch?: () => void;
}

export const VolunteerRequestItem: FunctionComponent<VolunteerRequestItemProps> = (props) => {
    const { request, locations, refetch } = props;

    const [ openModal, setOpenModal ] = useState(false);
    const [ editMode, setEditMode ] = useState(false);

    const [ fulfillVolunteerRequest, { loading: fulfilling }] = useMutation<{ id: number }>(Queries.FULFILL_REQUEST);
    const [ deleteVolunteerRequest, { loading: deleting }] = useMutation<{ id: number }>(Queries.DELETE_VOLUNTEER_REQUEST);

    let locationString = "General";

    if (request.placeId) {
        const index = locations.findIndex((location) => location.placeId === request.placeId);
        if (index > -1) {
            locationString = locations[index].formattedAddress;
        }
    }

    const onFulfillRequest = async () => {
        try {
            await fulfillVolunteerRequest({
                variables: {
                    id: parseInt((request.id as unknown) as string),
                }
            });
            setOpenModal(false);
            setEditMode(false);

            if (refetch) refetch();
        }  catch (e) {
            let parsedErrors = (e as ApolloError).graphQLErrors;
            const messages = parsedErrors.map((err) => err.message);
            
            for (let message of messages) {
                toast.error(message);
            }
        }
    }

    const onDeleteVolunteerRequest = async () => {
        const r = confirm("Are you sure you want to delete this request?");
        if (!r) return;

        try {
            await deleteVolunteerRequest({
                variables: {
                    id: parseInt((request.id as unknown) as string),
                }
            });
            setOpenModal(false);
            setEditMode(false);
            
            if (refetch) refetch();
        }  catch (e) {
            let parsedErrors = (e as ApolloError).graphQLErrors;
            const messages = parsedErrors.map((err) => err.message);
            
            for (let message of messages) {
                toast.error(message);
            }
        }
    }

    const DetailedModal = (
        <Modal
            title={request.title ? request.title : ""}
            open={openModal}
            onClose={() => {
                setOpenModal(false);
                setEditMode(false);
            }}
        >
            {editMode ? (
                <VolunteerRequestForm 
                    request={request}
                    onSuccess={() => {
                        if (refetch) refetch();
                    }}
                />
            ) : (
                <div>
                    <div>
                        <Button type="default" onMouseDown={() => {
                            setEditMode(true);
                        }}>
                            <PencilIcon className="text-white w-4 h-4" />Edit
                        </Button>
                    </div>
                    <div className="pt-4">
                        <SummaryLine label="Title">
                            {request.title}
                        </SummaryLine>
                        <SummaryLine label="Description">
                            {request.description}
                        </SummaryLine>
                        <SummaryLine label="Location">
                            {locationString}
                        </SummaryLine>
                        <SummaryLine label="Status">
                            {request.status}
                        </SummaryLine>
                        <SummaryLine label="Skills">
                            <div className="flex gap-2">
                                {request.skills?.map((skill, i) => (
                                    <span key={i} className="p-2 bg-teal-800 text-white rounded-md text-sm">{skill}</span>
                                ))}
                            </div>
                        </SummaryLine>
                        <SummaryLine label="Created At">
                            {moment(request.createdAt).format()}
                        </SummaryLine>
                        <SummaryLine label="Last Update At">
                            {moment(request.updatedAt).format()}
                        </SummaryLine>
                    </div>
                    <div className="flex gap-1">
                        <Button 
                            type="secondary" 
                            onMouseDown={onFulfillRequest}
                            loading={fulfilling}
                        >
                            <CheckIcon className="text-white w-4 h-4" /> Fulfilled
                        </Button>
                        <Button 
                            type="danger" 
                            loading={deleting}
                            onMouseDown={() => {
                                onDeleteVolunteerRequest();
                            }}
                        >
                            <TrashIcon className="text-white w-4 h-4" /> Delete
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    )

    return (
        <div className="flex justify-between bg-white py-2 px-4 rounded-md">
            <div>
                <a 
                    href="" 
                    onClick={(e) => {
                        setOpenModal(true);
                        e.preventDefault();
                    }}
                >
                    <h6 className="text-lg font-semibold flex items-center">
                        {request.title}
                        {request.status === VolunteerRequestStatus.Completed ? (
                            <CheckCircleIcon className="w-4 h-4 ml-2 text-green-700" /> 
                        ) : null}
                    </h6>
                </a>
                <div>
                    <span className="text-sm">{locationString}</span>
                </div>
                <div className="py-2 gap-1 flex">
                    {request.skills?.map((skill, i) => (
                        <span key={i} className="p-2 bg-teal-800 text-white rounded-md text-sm">{skill}</span>
                    ))}
                </div>
                <div>
                    <span className="text-sm text-gray-400">Updated {moment(request.updatedAt).from(moment())}</span>
                </div>
            </div>
            {DetailedModal}
        </div>
    )
}