import { FunctionComponent } from "react";
import { gql, useQuery, useMutation, ApolloError } from "@apollo/client";
import { FormikErrors, useFormik } from "formik";
import { toast } from "react-toastify";

// types
import { VolunteerRequestStatus, VolunteerRequestInput, VolunteerRequest } from "../types/volunteerRequest.type";
import { Location } from "../types/location.type";

// components
import { Loading } from "../components/Loading";
import { InputText, InputNumber } from "../components/Input";
import { Select } from "../components/Select";
import { FormItem } from "../components/Form";
import { TagInput } from "../components/TagInput";
import Button from "../components/Button";
import Modal from "../components/Modal";

// queries
import { OrganizationQueries } from "../queries/organization.queries";


const Queries = {
    CREATE_VOLUNTEER_REQUEST: gql`
        mutation CreateVolunteerRequest($data: VolunteerRequestInput!){
            createVolunteerRequest(data: $data)
        }
    `,
    UPDATE_VOLUNTEER_REQUEST: gql`
        mutation UpdateVolunteerRequest($id: Int!, $data: VolunteerRequestInput!){
            updateVolunteerRequest(id: $id, data: $data)
        }
    `,
}

interface VolunteerRequestFormProps{
    request?: VolunteerRequest;
    onSuccess: () => void;
}

export const VolunteerRequestForm: FunctionComponent<VolunteerRequestFormProps> = (props) => {
    const { request, onSuccess } = props;

    let inputStyles = ["flex-1 px-3 py-2 border rounded-md"];
    const initialValues = request ? request : {} as VolunteerRequestInput;

    const { data, loading } = useQuery(OrganizationQueries.GET_MY_ORGANIZATION);
    const [ createVolunteerRequest, { loading: submitting }] = useMutation<VolunteerRequestInput>(Queries.CREATE_VOLUNTEER_REQUEST);
    const [ updateVolunteerRequest, { loading: updating }] = useMutation<{ id: number, data: VolunteerRequestInput}>(Queries.UPDATE_VOLUNTEER_REQUEST);


    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: async (values) => {
            try {
                if (request) {
                    await updateVolunteerRequest({
                        variables: {
                            data: {
                                title: values.title,
                                description: values.description,
                                placeId: values.placeId,
                                skills: values.skills,
                                status: VolunteerRequestStatus.Active,
                            },
                            id: parseInt((request.id as unknown) as string),
                        }
                    });
                } else {
                    await createVolunteerRequest({
                        variables: {
                            data: {
                                title: values.title,
                                description: values.description,
                                placeId: values.placeId,
                                skills: values.skills,
                                status: VolunteerRequestStatus.Active,
                            }
                        }
                    });
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
            const errors: FormikErrors<VolunteerRequest> = {};

            if (!values.title) errors.title = "Title is required";
            if (!values.description) errors.description = "Description is required";

            return errors;
        }
    });

    const { values, errors } = formik;

    if (loading) return <Loading />;

    return (
        <div>
            <div>
                <FormItem
                    label="Request Title"
                    help={errors.title ? errors.title: undefined}
                    status={errors.title ? "error" : undefined}
                    required
                >
                    <InputText 
                        value={values.title}
                        onChange={(value) => formik.setFieldValue("title", value)}
                        placeholder="Enter request item"
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
                            ...data?.me?.organization.locations.map((location: Location) => ({
                                label: location.formattedAddress,
                                value: location.placeId,
                            })) ?? []
                        ]}
                    />
                </FormItem>
                <FormItem
                    label="Description"
                    help={errors.description ? errors.description: undefined}
                    status={errors.description ? "error" : undefined}
                    required
                >
                    <textarea 
                        rows={5}
                        value={values.description ? values.description : ""}
                        onChange={(e) => formik.setFieldValue("description", e.target.value)}
                        className={`w-full ${inputStyles.join(" ")}`}
                    />
                </FormItem>
                <FormItem
                    label="Skills"
                >
                    <TagInput 
                        onChange={(values) => {
                            formik.setFieldValue("skills", values);
                        }}
                        placeholder="Type and press enter to add skill"
                        values={values.skills}
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
        </div>
    );
}

interface VolunteerRequestFormModalProps{
    onClose: () => void;
    visible: boolean;
}

export const VolunteerRequestFormModal: FunctionComponent<VolunteerRequestFormModalProps> = (props) => {
    const { onClose, visible } = props;

    return (

        <Modal
            title="Volunteer Request"
            onClose={() => {
                onClose();
            }}
            open={visible}
        >
            <VolunteerRequestForm 
                onSuccess={onClose}
            />
        </Modal>
    )
}