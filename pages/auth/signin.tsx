import { Formik, FormikErrors } from "formik";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation, ApolloError } from "@apollo/client";
import { toast } from "react-toastify";
import { useContext } from "react";

// components
import { FormItem } from "../../components/Form";
import Button from "../../components/Button";
import { InputText } from "../../components/Input";

// containers
import LayoutWithoutAuth from "../../containers/LayoutWithoutAuth";

// localized
import { retrieveLocalizedString, LanguageContext } from "../../localize";

// queries or mutations
import { AuthMutations } from "../../queries/auth.queries";

// auth
import { setTokenCookie } from "../../lib/auth-cookies";

// styles
import styles from '../../styles/Home.module.css'

const WHATSAPP_LINK = process.env.NEXT_PUBLIC_WHATSAPP_LINK ?? "";

interface SignInForm{
    email: string;
    password: string;
}

const SignIn: NextPage = () => {
    const router = useRouter();
    const { language } = useContext(LanguageContext);
    const [ signIn, { loading: submitting }] = useMutation(AuthMutations.signIn);

    return (
        <div>
            <div className={styles.container} style={{ width: "100%" }}>
                <div className="py-8">
                    <h3 className="text-2xl font-bold">{retrieveLocalizedString(language, "SignInHeading")}</h3>
                    <p className="py-2">{retrieveLocalizedString(language, "SignInDescription")}</p>
                </div>
                <div>
                    <Formik
                        initialValues={{

                        } as SignInForm}
                        onSubmit={async (values) => {
                            try {
                                console.log(values);
                                const resp = await signIn({ 
                                    variables: { 
                                        data: values,
                                    } 
                                });

                                setTokenCookie(resp.data.signIn.token);
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
                            const errors: FormikErrors<SignInForm> = {};
                            if (!values.email) errors.email = retrieveLocalizedString(language, "SignInEmailRequired");
                            if (!values.password) errors.password = retrieveLocalizedString(language, "SignInPasswordRequired");
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
                                        onChange={(value) => setFieldValue("email", value)}
                                        type="email"
                                    />
                                </FormItem>
                                <FormItem
                                    label={retrieveLocalizedString(language, "FieldsPassword")}
                                    help={errors.password ? errors.password : undefined}
                                    status={errors.password ? "error" : undefined}
                                    required
                                >
                                    <InputText 
                                        value={values.password}
                                        onChange={(value) => setFieldValue("password", value)}
                                        type="password"
                                    />
                                </FormItem>
                                <div>
                                    <Button 
                                        type="primary" 
                                        onMouseDown={() => submitForm()}
                                        loading={submitting}
                                    >{retrieveLocalizedString(language, "SignInText")}</Button>
                                </div>
                                <div className="py-4">
                                    <div className="mb-1">
                                        <Link href="/auth/forgot-password"><a>{retrieveLocalizedString(language, "ForgotPassword")}</a></Link>
                                    </div>
                                    <div>
                                        {retrieveLocalizedString(language, "DontHaveAnAccountText")} <Link href="/auth/signup"><a>{retrieveLocalizedString(language, "SignUpText")}</a></Link>
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

const SignInContainer = () => (
    <LayoutWithoutAuth>
        <SignIn />
    </LayoutWithoutAuth>
)

export default SignInContainer;