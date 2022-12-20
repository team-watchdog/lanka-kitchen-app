import { Formik, FormikErrors } from "formik";
import { NextPage } from "next";
import Link from "next/link";
import { useContext } from "react";
import { useMutation, ApolloError } from "@apollo/client";

// containers
import LayoutWithoutAuth from "../../containers/LayoutWithoutAuth";

// components
import { FormItem } from "../../components/Form";
import Button from "../../components/Button";
import { InputText } from "../../components/Input";

// queries and mutations
import { AuthMutations } from "../../queries/auth.queries";

// localized
import { retrieveLocalizedString, LanguageContext } from "../../localize";


interface ForgotPasswordInput{
    email: string;
}

const ForgotPassword: NextPage = () => {
    const { language } = useContext(LanguageContext);
    const [ forgotPassword, { loading: submitting }] = useMutation(AuthMutations.forgotPassword);

    return (
        <div>
            <div className="container max-w-screen-md m-auto">
                <div className="py-8">
                    <h3 className="text-2xl font-bold">{retrieveLocalizedString(language, "ForgotPasswordHeading")}</h3>
                </div>
                <div>
                    <Formik
                        initialValues={{

                        } as ForgotPasswordInput}
                        onSubmit={async (values) => {
                            try {
                                console.log(values);
                                const resp = await forgotPassword({ 
                                    variables: { 
                                        data: values,
                                    } 
                                });
                            } catch (e) {
                                let parsedErrors = (e as ApolloError).graphQLErrors;
                                const messages = parsedErrors.map((err) => err.message);
                                console.log(messages);
                            }
                        }}
                        validate={(values) => {
                            const errors: FormikErrors<ForgotPasswordInput> = {};
                            if (!values.email) {
                                errors.email = retrieveLocalizedString(language, "ForgotPasswordEmailRequired");
                            }
                            return errors;
                        }}
                    >
                        {({ values, errors, setFieldValue, submitForm }) => (
                            <div>
                                <FormItem
                                    label={retrieveLocalizedString(language, "FieldsEmail")}
                                    help={errors.email ? errors.email : undefined}
                                    status={errors.email ? "error" : undefined}
                                    required
                                >
                                    <InputText 
                                        value={values.email}
                                        type="email"
                                        onChange={(value) => setFieldValue("email", value)}
                                    />
                                </FormItem>
                                <div>
                                    <Button 
                                        type="primary" 
                                        onMouseDown={() => submitForm()}
                                        loading={submitting}
                                    >{retrieveLocalizedString(language, "ResetPasswordText")}</Button>
                                </div>
                                <div className="py-4">
                                    <div>
                                        {retrieveLocalizedString(language, "AlreadyHaveAnAccountText")} <Link href="/auth/signin"><a>{retrieveLocalizedString(language, "SignInText")}</a></Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

const ForgotPasswordContainer = () => (
    <LayoutWithoutAuth>
        <ForgotPassword />
    </LayoutWithoutAuth>
)

export default ForgotPasswordContainer;