import { FunctionComponent, useState } from "react";
import { gql, useMutation, useQuery, ApolloError } from "@apollo/client";
import { FormikErrors, useFormik } from "formik";
import { toast } from "react-toastify";

// components
import Modal from "../components/Modal";
import { FormItem } from "../components/Form";
import { Loading } from "../components/Loading";
import { InputText, InputNumber } from "../components/Input";
import { Select } from "../components/Select";
import Button from "../components/Button";

// types
import { Location } from "../types/location.type";
import { RequestInput, RequestStatus, RequestType, Unit, Request } from "../types/request.type";

// queries
import { OrganizationQueries } from "../queries/organization.queries";

interface RequestFormProps{
    request?: Request;
    onSuccess: () => void;
}

const Queries = {
    GET_REQUESTS: gql`
        query GetOrganizationRequests($id: Int!){
            getOrganizationRequests(id: $id) {
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
    CREATE_REQUEST: gql`
        mutation CreateRequest($data: RequestInput!){
            createRequest(data: $data)
        }
    `,
    UPDATE_REQUEST: gql`
        mutation UpdateRequest($id: Int!, $data: RequestInput!){
            updateRequest(id: $id, data: $data)
        }
    `,
}

export const RequestForm: FunctionComponent<RequestFormProps> = (props) => {
    const { request, onSuccess } = props;

    const { data, loading } = useQuery(OrganizationQueries.GET_MY_ORGANIZATION);
    const [ createRequest, { loading: submitting }] = useMutation(Queries.CREATE_REQUEST);
    const [ updateRequest, { loading: updating }] = useMutation(Queries.UPDATE_REQUEST);

    const formik = useFormik({
        initialValues: request ? request : {
            requestType: RequestType.Ration,
            placeId: null,
            unit: Unit.Nos,
        } as RequestInput,
        onSubmit: async (values) => {
            try {
                if (request) {
                    await updateRequest({
                        variables: {
                            id: parseInt((request.id as unknown) as string),
                            data: {
                                itemName: values.itemName,
                                requestType: values.requestType,
                                placeId: values.placeId,
                                unit: values.unit,
                                quantity: values.quantity,
                                status: RequestStatus.Active,
                            }
                        }
                    });
                    toast.success("Request updated successfully");
                } else {
                    await createRequest({
                        variables: {
                            data: {
                                itemName: values.itemName,
                                requestType: values.requestType,
                                placeId: values.placeId,
                                unit: values.unit,
                                quantity: values.quantity,
                                status: RequestStatus.Active,
                            }
                        }
                    });
                    toast.success("Request created successfully");
                }

                onSuccess();
            } catch (e) {
                let parsedErrors = (e as ApolloError).graphQLErrors;
                const messages = parsedErrors.map((err) => err.message);
                
                for (let message of messages) {
                    toast.error(message);
                }
            }
        },
        validate: (values) => {
            const errors: FormikErrors<RequestInput> = {};

            if (!values.itemName) errors.itemName = "Item name is required";
            if (!values.quantity) errors.quantity = "Quantity is required";

            return errors;
        }
    });

    const { values, errors } = formik;

    return loading ? <Loading /> : (
        <div>
            <FormItem
                label="Item Name"
                required
                help={errors.itemName ? errors.itemName : undefined}
                status={errors.itemName ? "error" : undefined}
            >
                <InputText 
                    placeholder="Enter request item"
                    value={values.itemName}
                    onChange={(value) => formik.setFieldValue("itemName", value)}
                />
            </FormItem>
            <FormItem
                label="Request Type"
                required
            >
                <Select 
                    value={values.requestType}
                    onChange={(value) => {
                        formik.setFieldValue("requestType", value);
                    }}
                    options={[
                        {
                            label: "Ration",
                            value: RequestType.Ration,
                        },
                        {
                            label: "Equipment",
                            value: RequestType.Equipment,
                        },
                    ]}
                />
            </FormItem>
            <FormItem
                label="Location"
                required
            >
                <Select 
                    value={values.placeId}
                    onChange={(value) => {
                        formik.setFieldValue("placeId", value);
                    }}
                    options={[
                        {
                            label: "General",
                            value: null,
                        },
                        ...data.me.organization.locations.map((location: Location) => ({
                            label: location.formattedAddress,
                            value: location.placeId,
                        }))
                    ]}
                />
            </FormItem>
            <FormItem
                label="Unit"
                required
            >
                <Select 
                    value={values.unit}
                    onChange={(value) => {
                        formik.setFieldValue("unit", value);
                    }}
                    options={[
                        {
                            label: "KG",
                            value: Unit.Kg,
                        },
                        {
                            label: "L",
                            value: Unit.L,
                        },
                        {
                            label: "ML",
                            value: Unit.ML,
                        },
                        {
                            label: "Nos",
                            value: Unit.Nos,
                        }
                    ]}
                />
            </FormItem>
            <FormItem
                label="Quantity"
                required
                help={errors.quantity ? errors.quantity : undefined}
                status={errors.quantity ? "error" : undefined}
            >
                <InputNumber 
                    value={values.quantity}
                    onChange={(value) => formik.setFieldValue("quantity", value)}
                />
            </FormItem>
            <div>
                <Button 
                    type="primary" 
                    onMouseDown={() => {
                        formik.submitForm();
                    }}
                    loading={request ? updating : submitting}
                >{request ? "Update Request" : "Create Request"}</Button>
            </div>
        </div>
    );
}

interface RequestFormModalProps{
    onClose: () => void;
    visible: boolean;
}

export const RequestFormModal: FunctionComponent<RequestFormModalProps> = (props) => {
    const { onClose, visible } = props;

    return (
        <Modal
            title="Item Request"
            onClose={() => {
                onClose();
            }}
            open={visible}
        >
            <RequestForm 
                onSuccess={() => {
                    onClose();
                }}
            />
        </Modal>
    )
}