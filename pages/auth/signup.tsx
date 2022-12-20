import { Formik, FormikErrors } from "formik";
import { NextPage } from "next";
import Link from "next/link";
import { useContext } from "react";
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
import { retrieveLocalizedString, LanguageContext } from "../../localize";

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

    const { language } = useContext(LanguageContext);

    const [ signUp, { loading: submitting }] = useMutation(AuthMutations.signUp);

    return (
        <div className="container max-w-screen-md m-auto">
            <div className="py-8">
                <h3 className="text-2xl font-bold">{retrieveLocalizedString(language, "SignUpHeading")}</h3>
                <p className="py-2">{retrieveLocalizedString(language, "SignUpDescription")}</p>
                <a href="">{retrieveLocalizedString(language, "SignUpLearnMore")}</a>
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

                        if (!values.organizationName) errors.organizationName = retrieveLocalizedString(language, "SignUpOrganizationNameRequired");
                        if (!values.firstName) errors.firstName = retrieveLocalizedString(language, "SignUpFirstNameRequired");
                        if (!values.lastName) errors.lastName = retrieveLocalizedString(language, "SignUpLastNameRequired");

                        if (!values.email) errors.email = retrieveLocalizedString(language, "SignUpEmailRequired");
                        else if (!isEmail(values.email)) errors.email = retrieveLocalizedString(language, "SignUpEmailInvalid");

                        if (!values.contactNumber) errors.contactNumber = retrieveLocalizedString(language, "SignUpContactNumberRequired");

                        if (!values.password || values.password.length < 6) errors.password = retrieveLocalizedString(language, "SignUpMinimumLength");
                        if (!values.confirmPassword || values.password !== values.confirmPassword) errors.confirmPassword = retrieveLocalizedString(language, "SignUpPasswordMismatch");

                        return errors;
                    }}
                >
                    {({ values, errors, setFieldValue, submitForm }) => (
                        <div>
                            <FormItem
                                label={retrieveLocalizedString(language, "FieldsOrganizationName")}
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
                                label={retrieveLocalizedString(language, "FieldsFirstName")}
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
                                label={retrieveLocalizedString(language, "FieldsLastName")}
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
                                label={retrieveLocalizedString(language, "FieldsEmail")}
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
                                label={retrieveLocalizedString(language, "FieldsContact")}
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
                                label={retrieveLocalizedString(language, "FieldsPassword")}
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
                                label={retrieveLocalizedString(language, "FieldsPasswordConfirm")}
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
                                {retrieveLocalizedString(language, "AlreadyHaveAnAccountText")} <Link href="/auth/signin"><a>{retrieveLocalizedString(language, "SignInText")}</a></Link>
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