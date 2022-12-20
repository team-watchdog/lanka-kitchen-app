import { FunctionComponent, useEffect } from "react";
import { gql, useMutation, useQuery, ApolloError } from "@apollo/client";
import { TrashIcon } from "@heroicons/react/solid";
import { FormikErrors, useFormik } from "formik";
import isEmail from "validator/lib/isEmail";
import isURL from "validator/lib/isURL";
import { toast } from "react-toastify";

// components
import Button from "../../components/Button";
import { FormItem } from "../../components/Form";
import { InputText } from "../../components/Input";

// types
import { ContactDetailsUpdatePayload } from "../../types/organization.type";
import { Loading } from "../../components/Loading";

const Queries = {
    GET_ORGANIZATION_CONTACT_DETAILS: gql`
        query Organization{
            me{
                organization{
                    id
                    phoneNumbers
                    email
                    website
                    instagram
                    facebook
                    twitter
                    paymentLink
                }
            }
        }
    `,
    UPDATE_CONTACT_DETAILS: gql`
        mutation UpdateContactDetails($data: ContactDetailsUpdateInput!){
            updateContactDetails(data: $data)
        }
    `,
}

interface ContactDetailsUpdatePayloadForm extends ContactDetailsUpdatePayload {
    newPhoneNumber: string;
}

const ContactDetailsForm: FunctionComponent = () => {
    const initialValues = { 
        phoneNumbers: [] as string[],
        newPhoneNumber: "",
    } as ContactDetailsUpdatePayloadForm;

    const { data, loading, refetch } = useQuery(Queries.GET_ORGANIZATION_CONTACT_DETAILS);
    const [ updateContactDetails, { loading: submitting } ] = useMutation(Queries.UPDATE_CONTACT_DETAILS);

    const formik = useFormik({
        initialValues,
        onSubmit: async (values) => {
            try {
                await updateContactDetails({
                    variables: {
                        data: {
                            payload: {
                                phoneNumbers: values.phoneNumbers,
                                email: values.email,
                                website: values.website,
                                instagram: values.instagram,
                                twitter: values.twitter,
                                facebook: values.facebook,
                                paymentLink: values.paymentLink,
                            }
                        }
                    }
                });
                toast.success("Organization contact details updated successfully!");
                refetch();
            } catch (e) {
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
        },
        validate: (values) => {
            const errors: FormikErrors<ContactDetailsUpdatePayloadForm> = {};

            if (!values.email || !isEmail(values.email)) errors["email"] = "Email is invalid";
            if (values.website && !isURL(values.website)) errors["website"] = "Website is invalid";
            if (values.facebook && !isURL(values.facebook)) errors["facebook"] = "Facebook is invalid";
            if (values.instagram && !isURL(values.instagram)) errors["instagram"] = "Instagram is invalid";
            if (values.twitter && !isURL(values.twitter)) errors["twitter"] = "Twitter is invalid";
            if (values.paymentLink && !isURL(values.paymentLink)) errors["paymentLink"] = "Payment link is invalid";

            return errors;
        }
    });

    useEffect(() => {
        if (data?.me?.organization) {
            formik.setValues({
                ...data.me.organization,
                newPhoneNumber: "",
            } as ContactDetailsUpdatePayloadForm);
        }
    }, [ data ])

    const { values, errors } = formik;

    if (loading) return <Loading />;

    return (
        <div>
            <FormItem label="Phone Numbers">
                <div className="flex flex-col">
                    <ul className="list-disc list-inside leading-7 mb-2">
                        {values.phoneNumbers.map((phoneNumber, index) => (
                            <li>
                                <span className="inline-flex items-center">
                                    <a href="">{phoneNumber}</a>
                                    <a 
                                        className="text-red-500 inline-block ml-2"
                                        onClick={(e) => {
                                            const tmp = [
                                                ...values.phoneNumbers.slice(0, index), 
                                                ...values.phoneNumbers.slice(index + 1)
                                            ];
                                            formik.setFieldValue("phoneNumbers", tmp);
                                        
                                            e.preventDefault();
                                        }}
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </a>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex gap-1">
                        <InputText 
                            value={values.newPhoneNumber}
                            placeholder="Enter your phone number"
                            onChange={(value) => { formik.setFieldValue("newPhoneNumber", value) }}
                        />
                        <Button type="default" onMouseDown={() => {
                            formik.setFieldValue("phoneNumbers", [...values.phoneNumbers, values.newPhoneNumber]);
                            formik.setFieldValue("newPhoneNumber", "");
                        }}>Add</Button>
                    </div>
                </div>
            </FormItem>
            <FormItem 
                label="Contact Email"
                status={errors.email ? "error" : null}
                help={errors.email}
                required
            >
                <InputText 
                    value={values.email}
                    status={errors.email ? "error" : undefined}
                    onChange={(value) => { formik.setFieldValue("email", value) }}
                />
            </FormItem>
            <FormItem 
                label="Social Media"
            >
                <div className="flex flex-col gap-2 flex-1">
                    <InputText 
                        placeholder="Website"
                        value={values.website}
                        status={errors.website ? "error" : undefined}
                        onChange={(value) => { formik.setFieldValue("website", value) }}
                    />
                    <InputText 
                        placeholder="Facebook"
                        status={errors.facebook ? "error" : undefined}
                        value={values.facebook}
                        onChange={(value) => { formik.setFieldValue("facebook", value) }}
                    />
                    <InputText 
                        placeholder="Instagram"
                        status={errors.instagram ? "error" : undefined}
                        value={values.instagram}
                        onChange={(value) => { formik.setFieldValue("instagram", value) }}
                    />
                    <InputText
                        placeholder="Twitter"
                        status={errors.twitter ? "error" : undefined}
                        value={values.twitter}
                        onChange={(value) => { formik.setFieldValue("twitter", value) }}
                    />
                    <InputText
                        placeholder="Payment Link"
                        status={errors.paymentLink ? "error" : undefined}
                        value={values.paymentLink}
                        onChange={(value) => { formik.setFieldValue("paymentLink", value) }}
                    />
                </div>
            </FormItem>
            <div>
                <Button 
                    type="primary" 
                    loading={submitting}
                    onMouseDown={() => {
                        formik.submitForm();
                    }}
                >Update</Button>
            </div>
        </div>
    )
}

export default ContactDetailsForm;