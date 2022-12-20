import { FunctionComponent, useEffect } from "react";
import { FormikErrors, useFormik } from "formik";
import { gql, useMutation, useQuery, ApolloError } from "@apollo/client";
import { toast } from "react-toastify";

// components
import Button from "../../components/Button";
import { FormItem } from "../../components/Form";
import { InputText } from "../../components/Input";

// types
import { BankDetailsUpdatePayload } from "../../types/organization.type";

const Queries = {
    GET_ORGANIZATION_BANK_DETAILS: gql`
        query Organization{
            me{
                organization{
                    id
                    bankName
                    accountNumber
                    accountName
                    accountType
                    branchName
                    notes
                }
            }
        }
    `,
    UPDATE_BANK_DETAILS: gql`
        mutation UpdateBankDetails($data: BankDetailsUpdateInput!){
            updateBankDetails(data: $data)
        }
    `,
}

const BankDetailsForm: FunctionComponent = () => {
    let inputStyles = ["flex-1 px-3 py-2 border rounded-md"];

    const initialValues = {} as BankDetailsUpdatePayload;

    const { data, loading, refetch } = useQuery(Queries.GET_ORGANIZATION_BANK_DETAILS);
    const [ updateBankDetails, { loading: submitting } ] = useMutation(Queries.UPDATE_BANK_DETAILS);
    
    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: async (values) => {
            try {
                await updateBankDetails({
                    variables: {
                        data: {
                            payload: {
                                bankName: values.bankName,
                                accountNumber: values.accountNumber,
                                accountName: values.accountName,
                                accountType: values.accountType,
                                branchName: values.branchName,
                                notes: values.notes,
                            }
                        }
                    }
                });
                refetch();
                toast.success("Bank details updated successfully");
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
        validate: (value) => {
            const errors: FormikErrors<BankDetailsUpdatePayload> = {};

            if (!value.accountName) errors.accountName = "Account name is required";
            if (!value.bankName) errors.bankName = "Bank name is required";
            if (!value.branchName) errors.branchName = "Branch name is required";
            if (!value.accountNumber) errors.accountNumber = "Account number is required";
            if (!value.accountType) errors.accountType = "Account type is required";

            return errors;
        },
    });

    useEffect(() => {
        if (data?.me?.organization) {
            formik.setValues(data.me.organization);
        }
    }, [ data ]);

    const { values, errors } = formik;

    return (
        <div>
            <FormItem 
                label="Account Name" 
                required
                help={errors.accountName}
                status={errors.accountName ? "error" : undefined}
            >
                <InputText 
                    value={values.accountName}
                    onChange={(value) => formik.setFieldValue("accountName", value)}
                />
            </FormItem>
            <FormItem 
                label="Bank Name" 
                required
                help={errors.bankName}
                status={errors.bankName ? "error" : undefined}
            >
                <InputText 
                    value={values.bankName}
                    onChange={(value) => formik.setFieldValue("bankName", value)}
                />
            </FormItem>
            <FormItem 
                label="Branch Name" 
                required
                help={errors.branchName}
                status={errors.branchName ? "error" : undefined}
            >
                <InputText 
                    value={values.branchName}
                    onChange={(value) => formik.setFieldValue("branchName", value)}
                />
            </FormItem>
            <FormItem 
                label="Account Number" 
                required
                help={errors.accountNumber}
                status={errors.accountNumber ? "error" : undefined}
            >
                <InputText 
                    value={values.accountNumber}
                    onChange={(value) => formik.setFieldValue("accountNumber", value)}
                />
            </FormItem>
            <FormItem
                label="Account Type" 
                required
                help={errors.accountType}
                status={errors.accountType ? "error" : undefined}
            >
                <InputText 
                    value={values.accountType}
                    onChange={(value) => formik.setFieldValue("accountType", value)}
                />
            </FormItem>
            <FormItem label="Notes">
                <textarea 
                    className={inputStyles.join(" ")}
                    value={values.notes ? values.notes : undefined}
                    onChange={(e) => formik.setFieldValue("notes", e.target.value)}
                    rows={4}
                />
            </FormItem>
            <div>
                <Button 
                    type="primary" 
                    onMouseDown={() => {
                        formik.submitForm();
                    }}
                >Update</Button>
            </div>
        </div>
    )
}

export default BankDetailsForm;