import { Formik, FormikErrors } from "formik";
import { NextPage } from "next";
import Link from "next/link";
import isEmail from "validator/lib/isEmail";
import { ApolloError, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';

// containers
import LayoutWithoutAuth from "../../containers/LayoutWithoutAuth";

// components
import { FormItem } from "../../components/Form";
import Button from "../../components/Button";
import { InputText } from "../../components/Input";

// localized
import { getLocalizedString } from "../../localize";

// queries and mutations
import { AuthMutations } from "../../queries/auth.queries";

// auth
import { setTokenCookie } from "../../lib/auth-cookies";
import { useAuth } from "../../lib/auth";
import { useEffect } from "react";

interface SignUpForm{
    organizationName: string;
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    password: string;
    confirmPassword: string;
}

const SignUp: NextPage = () => {
    const lang = "en";
    const router = useRouter();

    const [ signUp, { loading: submitting }] = useMutation(AuthMutations.signUp);

    return (
        <div className="container max-w-screen-md m-auto">
            <div className="py-8">
                <h3 className="text-2xl font-bold">{getLocalizedString("SignUpHeading", lang)}</h3>
                <p className="py-2">{getLocalizedString("SignUpDescription", lang)}</p>
                <a href="">{getLocalizedString("SignUpLearnMore", lang)}</a>
            </div>
            <div>
                <Formik
                    initialValues={{

                    } as SignUpForm}
                    onSubmit={async (values) => {
                        try {
                            const tmpValues: {[key: string]: unknown} = {...values};
                            delete tmpValues["confirmPassword"];

                            const resp = await signUp({
                                variables: {
                                    data: tmpValues,
                                }
                            });

                            setTokenCookie(resp.data.signUp.token);
                            router.push("/");

                        } catch (e) {
                            let parsedErrors = (e as ApolloError).graphQLErrors;
                            const messages = parsedErrors.map((err) => err.message);

                            for (let message of messages) {
                                toast.error(message);
                            }
                        }
                    }}
                    validate={(values) => {
                        const errors: FormikErrors<SignUpForm> = {};

                        if (!values.organizationName) errors.organizationName = getLocalizedString("SignUpOrganizationNameRequired", lang);
                        if (!values.firstName) errors.firstName = getLocalizedString("SignUpFirstNameRequired", lang);
                        if (!values.lastName) errors.lastName = getLocalizedString("SignUpLastNameRequired", lang);

                        if (!values.email) errors.email = getLocalizedString("SignUpEmailRequired", lang);
                        else if (!isEmail(values.email)) errors.email = getLocalizedString("SignUpEmailInvalid", lang);

                        if (!values.contactNumber) errors.contactNumber = getLocalizedString("SignUpContactNumberRequired", lang);

                        if (!values.password || values.password.length < 6) errors.password = getLocalizedString("SignUpMinimumLength", lang);
                        if (!values.confirmPassword || values.password !== values.confirmPassword) errors.confirmPassword = getLocalizedString("SignUpPasswordMismatch", lang);

                        return errors;
                    }}
                >
                    {({ values, errors, setFieldValue, submitForm }) => (
                        <div>
                            <FormItem
                                label={getLocalizedString("FieldsOrganizationName", lang)}
                                required
                                description="If you're an individual, enter your name here"
                                help={errors.organizationName}
                                status={errors.organizationName ? "error" : undefined}
                            >
                                <InputText 
                                    value={values.organizationName}
                                    onChange={(val) => setFieldValue("organizationName", val)}
                                />
                            </FormItem>
                            <FormItem
                                label={getLocalizedString("FieldsFirstName", lang)}
                                required
                                help={errors.firstName}
                                status={errors.firstName ? "error" : undefined}
                            >
                                <InputText 
                                    value={values.firstName}
                                    onChange={(val) => setFieldValue("firstName", val)}
                                />
                            </FormItem>
                            <FormItem
                                label={getLocalizedString("FieldsLastName", lang)}
                                required
                                help={errors.lastName}
                                status={errors.lastName ? "error" : undefined}
                            >
                                <InputText 
                                    value={values.lastName}
                                    onChange={(val) => setFieldValue("lastName", val)}
                                />
                            </FormItem>
                            <FormItem
                                label={getLocalizedString("FieldsEmail", lang)}
                                required
                                help={errors.email}
                                status={errors.email ? "error" : undefined}
                            >
                                <InputText 
                                    value={values.email}
                                    onChange={(val) => setFieldValue("email", val)}
                                    type="email"
                                />
                            </FormItem>
                            <FormItem
                                label={getLocalizedString("FieldsContact", lang)}
                                required
                                help={errors.contactNumber}
                                status={errors.contactNumber ? "error" : undefined}
                            >
                                <InputText 
                                    value={values.contactNumber}
                                    onChange={(val) => setFieldValue("contactNumber", val)}
                                />
                            </FormItem>
                            <FormItem
                                label={getLocalizedString("FieldsPassword", lang)}
                                required
                                help={errors.password}
                                status={errors.password ? "error" : undefined}
                            >
                                <InputText 
                                    type="password"
                                    value={values.password}
                                    onChange={(val) => setFieldValue("password", val)}
                                />
                            </FormItem>
                            <FormItem
                                label={getLocalizedString("FieldsPasswordConfirm", lang)}
                                required
                                help={errors.confirmPassword}
                                status={errors.confirmPassword ? "error" : undefined}
                            >
                                <InputText 
                                    type="password"
                                    value={values.confirmPassword}
                                    onChange={(val) => setFieldValue("confirmPassword", val)}
                                />
                            </FormItem>
                            <div>
                                <Button 
                                    loading={submitting}
                                    type="primary" 
                                    onMouseDown={() => {
                                        submitForm();
                                    }}
                                >Sign Up</Button>
                            </div>
                            <div className="py-4">
                                {getLocalizedString("AlreadyHaveAnAccountText", lang)} <Link href="/auth/signin"><a>{getLocalizedString("SignInText", lang)}</a></Link>
                            </div>
                        </div>
                    )}
                </Formik>
            </div>
        </div>
    )
}

const SignUpContainer = () => (
    <LayoutWithoutAuth>
        <SignUp />
    </LayoutWithoutAuth>
)

export default SignUpContainer;