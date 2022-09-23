import { FunctionComponent, useState } from "react";
import { CheckIcon, PencilIcon, TrashIcon, CheckCircleIcon } from "@heroicons/react/solid";
import moment from "moment";
import { gql, useMutation, ApolloError } from "@apollo/client";
import { toast } from "react-toastify";

// components
import Button from "../components/Button";
import Modal from "../components/Modal";
import { SummaryLine } from "../components/SummaryLine";

// containers
import { RequestForm } from "../containers/RequestForm";

// types
import { Request, RequestStatus, RequestType } from "../types/request.type";
import { Location } from "../types/location.type";

const Queries = {
    FULFILL_REQUEST: gql`
        mutation FulfillRequest($id: Int!){
            fulfillRequest(id: $id)
        }
    `,
    DELETE_REQUEST: gql`
        mutation DeleteRequest($id: Int!) {
            deleteRequest(id: $id)
        }
    `,
}

interface RequestItemProps{
    request: Request;
    locations: Location[];
    refetch?: () => void;
}

export const RequestItem: FunctionComponent<RequestItemProps> = (props) => {
    const { request, locations, refetch } = props;

    const [ fulfillRequest, { loading: fulfilling }] = useMutation<{ id: number }>(Queries.FULFILL_REQUEST);
    const [ deleteRequest, { loading: deleting }] = useMutation<{ id: number }>(Queries.DELETE_REQUEST);

    const [ openModal, setOpenModal ] = useState(false);
    const [ editMode, setEditMode ] = useState(false);

    let locationString = "General";

    if (request.placeId) {
        const index = locations.findIndex((location) => location.placeId === request.placeId);
        if (index > -1) {
            locationString = locations[index].formattedAddress;
        }
    }

    const onFulfillRequest = async () => {
        try {
            await fulfillRequest({
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

    const onDeleteRequest = async () => {
        const r = confirm("Are you sure you want to delete this request?");
        if (!r) return;

        try {
            await deleteRequest({
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
            title={request.itemName ? request.itemName : ""}
            open={openModal}
            onClose={() => {
                setOpenModal(false);
                setEditMode(false);
            }}
        >
            {editMode ? (
                <RequestForm 
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
                        <SummaryLine label="Item">
                            {request.itemName}
                        </SummaryLine>
                        <SummaryLine label="Type">
                            {request.requestType === RequestType.Equipment ? "Equipment": "Ration"}
                        </SummaryLine>
                        <SummaryLine label="Status">
                            {request.status}
                        </SummaryLine>
                        <SummaryLine label="Location">
                            {locationString}
                        </SummaryLine>
                        <SummaryLine label="Quantity">
                            {request.quantity} {request.unit}
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
                            <CheckIcon className="text-white w-4 h-4" /> Fullfilled
                        </Button>
                        <Button type="danger" loading={deleting} onMouseDown={() => {
                            onDeleteRequest();
                        }}>
                            <TrashIcon className="text-white w-4 h-4" /> Delete
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    )

    return (
        <div className="flex justify-between bg-white py-2 px-4 rounded-md">
            <div className="flex flex-col gap-1">
                <a 
                    href=""
                    onClick={(e) => {
                        setOpenModal(true);
                        e.preventDefault();
                    }}
                >
                    <h6 className="text-lg font-semibold flex items-center">
                        {request.itemName}
                        {request.status === RequestStatus.Completed ? (
                            <CheckCircleIcon className="w-4 h-4 ml-2 text-green-700" /> 
                        ) : null}
                    </h6>
                </a>
                <span>{request.quantity} {request.unit}</span>
                <span>{locationString}</span>
                <span className="text-sm text-gray-400">Updated {moment(request.updatedAt).from(moment())}</span>
            </div>
            {/*
            <div className="flex flex-row h-fit">
                <Button type="secondary" onMouseDown={() => {}}>
                    <CheckIcon className="text-white w-4 h-4" />
                </Button>
                <Button type="danger" onMouseDown={() => {}}>
                    <TrashIcon className="text-white w-4 h-4" />
                </Button>
            </div>
            */}
            {DetailedModal}
        </div>
    )
}