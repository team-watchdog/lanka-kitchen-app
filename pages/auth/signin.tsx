import { Formik, FormikErrors } from "formik";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation, ApolloError } from "@apollo/client";

// components
import { FormItem } from "../../components/Form";
import Button from "../../components/Button";
import { InputText } from "../../components/Input";

// containers
import LayoutWithoutAuth from "../../containers/LayoutWithoutAuth";

// localized
import { getLocalizedString } from "../../localize";

// queries or mutations
import { AuthMutations } from "../../queries/auth.queries";

// auth
import { setTokenCookie } from "../../lib/auth-cookies";

interface SignInForm{
    email: string;
    password: string;
}

const SignIn: NextPage = () => {
    const lang = "en";

    const router = useRouter();
    const [ signIn, { loading: submitting }] = useMutation(AuthMutations.signIn);

    return (
        <div>
            <div className="container max-w-screen-md m-auto">
                <div className="py-8">
                    <h3 className="text-2xl font-bold">{getLocalizedString("SignInHeading", lang)}</h3>
                    <p className="py-2">{getLocalizedString("SignInDescription", lang)}</p>
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
                                console.log(messages);
                            }
                        }}
                        validate={(values) => {
                            const errors: FormikErrors<SignInForm> = {};
                            if (!values.email) errors.email = getLocalizedString("SignInEmailRequired", lang);
                            if (!values.password) errors.password = getLocalizedString("SignInPasswordRequired", lang);
                            return errors;
                        }}
                    >
                        {({ values, errors, setFieldValue, submitForm }) => (
                            <div>
                                <FormItem
                                    label={getLocalizedString("FieldsEmail", lang)}
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
                                    label={getLocalizedString("FieldsPassword", lang)}
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
                                    >{getLocalizedString("SignInText", lang)}</Button>
                                </div>
                                <div className="py-4">
                                    <div className="mb-1">
                                        <Link href="/auth/forgot-password"><a>{getLocalizedString("ForgotPassword", lang)}</a></Link>
                                    </div>
                                    <div>
                                        {getLocalizedString("DontHaveAnAccountText", lang)} <Link href="/auth/signup"><a>{getLocalizedString("SignUpText", lang)}</a></Link>
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