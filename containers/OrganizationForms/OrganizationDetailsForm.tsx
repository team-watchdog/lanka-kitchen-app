import { FunctionComponent, useEffect } from "react";
import { useFormik, FormikErrors } from "formik";
import { gql, useQuery, useMutation, ApolloError } from "@apollo/client";
import { toast } from "react-toastify";

// components
import Button from "../../components/Button";
import { FormItem } from "../../components/Form";
import { InputText } from "../../components/Input";
import { Select } from "../../components/Select";
import { CheckboxGroup } from "../../components/Input";
import { ImageCropper } from "../../components/FileUpload";
import { Loading } from "../../components/Loading";

// types
import { OrganizationDetailsPayload } from "../../types/organization.type";

const Queries = {
    GET_ORGANIZATION_DETAILS: gql`
        query Organization{
            me{
                organization{
                    id
                    name
                    summary
                    description
                    assistanceTypes
                    assistanceFrequency
                    peopleReached
                    profileImageUrl
                }
            }
        }
    `,
    UPDATE_ORGANIZATION_DETAILS: gql`
        mutation UpdateOrganizationDetails($data: OrganizationDetailsUpdateInput!){
            updateOrganizationDetails(data: $data)
        }
    `,
}

const OrganizationDetailsForm: FunctionComponent = () => {
    let inputStyles = ["flex-1 px-3 py-2 border rounded-md"];

    const initialValues: OrganizationDetailsPayload = {
        assistanceFrequency: "Weekly",
        peopleReached: "1-20",
    } as OrganizationDetailsPayload;

    const { data, loading, refetch } = useQuery(Queries.GET_ORGANIZATION_DETAILS);
    const [ updateOrganizationDetails, { loading: submitting } ] = useMutation(Queries.UPDATE_ORGANIZATION_DETAILS);

    const formik = useFormik({
        initialValues: initialValues,
        validate: (values) => {
            const errors: FormikErrors<OrganizationDetailsPayload> = {};

            if (!values.name) errors["name"] = "Organization name is required";
            if (!values.summary) errors["summary"] = "Organization summary is required";
            if (!values.description) errors["description"] = "Organization description is required";

            return errors;
        },
        onSubmit: async (values) => {
            try {
                await updateOrganizationDetails({ 
                    variables: { 
                        data: {
                            payload: {
                                name: values.name,
                                profileImageUrl: values.profileImageUrl,
                                summary: values.summary,
                                description: values.description,
                                assistanceTypes: values.assistanceTypes,
                                assistanceFrequency: values.assistanceFrequency,
                                peopleReached: values.peopleReached,
                            }
                        } 
                    },
                });
                toast.success("Organization details updated successfully!");
                refetch();
            } catch(e) {
                let parsedError = e as ApolloError;
                let parsedErrors = parsedError.graphQLErrors;
                const messages = parsedErrors.map((err) => err.message);

                if (parsedError && parsedError.message) {
                    toast.error(parsedError.message);
                }
                
                for (let message of messages) {
                    toast.error(message);
                }
            }
        }
    });

    const { values, errors, setFieldValue } = formik;

    useEffect(() => {
        if (data?.me?.organization) {
            console.log(data.me.organization);
            formik.setValues({
                ...data.me.organization,
                assistanceFrequency: data.me.organization.assistanceFrequency || "Weekly",
                peopleReached: data.me.organization.peopleReached || "1-20",
            });
        }
    }, [ data ]);

    if (loading) return <Loading />;

    return (
        <form onSubmit={formik.submitForm}>
            <FormItem 
                label="Organization Name"
                required
                status={errors.name ? "error" : null}
                help={errors.name}
            >
                <InputText 
                    value={values.name}
                    status={errors.name ? "error" : undefined}
                    onChange={(value) => setFieldValue("name", value)}
                />
            </FormItem>
            <FormItem label="Organization Logo">
                <ImageCropper 
                    folderName="logos"
                    onFileUpload={(fileUrl, fileName) => {
                        setFieldValue("profileImageUrl", fileUrl);
                    }}
                />
            </FormItem>
            <FormItem 
                label="Summary" 
                required
                status={errors.summary ? "error" : null}
                help={errors.summary}
            >
                <InputText 
                    type="textarea"
                    rows={4}
                    value={values.summary}
                    status={errors.summary ? "error" : undefined}
                    onChange={(value) => setFieldValue("summary", value)}
                />
            </FormItem>
            <FormItem 
                label="Description" 
                required
                status={errors.description ? "error" : null}
                help={errors.description}
            >
                <InputText 
                    type="textarea"
                    rows={4}
                    value={values.description}
                    status={errors.description ? "error" : undefined}
                    onChange={(value) => setFieldValue("description", value)}
                />
            </FormItem>
            <FormItem label="Type of assistance provided" required>
                <CheckboxGroup 
                    options={[
                        { label: "Community Kitchen", value: "Community Kitchen" },
                        { label: "Meal Support", value: "Meal Support" },
                        { label: "Dry Ration Support", value: "Dry Ration Support" },
                        { label: "Mutual Aid", value: "Mutual Aid" },
                    ]}
                    values={values.assistanceTypes}
                    onChange={(values) => {
                        setFieldValue("assistanceTypes", values);
                    }}
                />
            </FormItem>
            <FormItem label="How often is this service provided" required>
                <Select 
                    placeholder="Select frequency"
                    options={[
                        {
                            label: "Every day",
                            value: "Every day"
                        },
                        {
                            label: "2-3 times a week",
                            value: "2-3 times a week"
                        },
                        {
                            label: "Weekly",
                            value: "Weekly"
                        },
                        {
                            label: "Fortnightly",
                            value: "Fortnightly"
                        },
                        {
                            label: "Monthly",
                            value: "Monthly"
                        }
                    ]}
                    value={values.assistanceFrequency ? values.assistanceFrequency : undefined}
                    onChange={(value) => {
                        setFieldValue("assistanceFrequency", value);
                    }}
                />
            </FormItem>
            <FormItem label="How many people are reached" required>
                <Select 
                    options={[
                        {
                            label: "1-20",
                            value: "1-20"
                        },
                        {
                            label: "20-50",
                            value: "20-50"
                        },
                        {
                            label: "50-100",
                            value: "50-100"
                        },
                        {
                            label: "100+",
                            value: "100+"
                        },
                        {
                            label: "500+",
                            value: "500+"
                        }
                    ]}
                    value={values.peopleReached ? values.peopleReached : undefined}
                    onChange={(value) => {
                        setFieldValue("peopleReached", value);
                    }}
                />
            </FormItem>
            <div>
                <Button 
                    type="primary" 
                    actionType="submit"
                    loading={submitting}
                    onMouseDown={() => {
                        formik.submitForm();
                    }}
                >Update</Button>
            </div>
        </form>
    )
}

export default OrganizationDetailsForm;