import { Formik, FormikErrors } from "formik";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation, ApolloError } from "@apollo/client";

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

interface ResetPasswordInput{
    accountId: number;
    resetCode: string;
    password: string;
    confirmPassword: string;
}

interface ResetPasswordProps{
    accountId: number;
    resetCode: string;
}

const ResetPassword: NextPage<ResetPasswordProps> = ({ accountId, resetCode }) => {
    const lang = "en";

    const router = useRouter();

    const [ resetPassword, { loading: submitting }] = useMutation(AuthMutations.resetPassword);

    return (
        <div>
            <div className="container max-w-screen-md m-auto">
                <div className="py-8">
                    <h3 className="text-2xl font-bold">{getLocalizedString("ResetPasswordHeading", lang)}</h3>
                </div>
                <div>
                    <Formik
                        initialValues={{
                            accountId: accountId,
                            resetCode: resetCode,
                        } as ResetPasswordInput}
                        onSubmit={async (values) => {
                            try {
                                console.log(values);
                                const resp = await resetPassword({ 
                                    variables: { 
                                        data: {
                                            password: values.password,
                                            accountId: values.accountId,
                                            resetCode: values.resetCode,
                                        },
                                    } 
                                });
                                router.push("/auth/signin");
                            } catch (e) {
                                let parsedErrors = (e as ApolloError).graphQLErrors;
                                const messages = parsedErrors.map((err) => err.message);
                                console.log(messages);
                            }
                        }}
                        validate={(values) => {
                            const errors: FormikErrors<ResetPasswordInput> = {};
                            if (!values.password) {
                                errors.password = getLocalizedString("ResetPasswordPasswordMinimumLength", lang);
                            } else if (values.password.length < 6) {
                                errors.password = getLocalizedString("ResetPasswordPasswordMinimumLength", lang);
                            }

                            if (!values.confirmPassword || values.confirmPassword !== values.password) {
                                errors.confirmPassword = getLocalizedString("ResetPasswordPasswordMismatch", lang);
                            }

                            return errors;
                        }}
                    >
                        {({ values, errors, setFieldValue, submitForm }) => (
                            <div>
                                <FormItem
                                    label={getLocalizedString("FieldsPassword", lang)}
                                    required
                                    help={errors.password}
                                    status={errors.password ? "error" : undefined}
                                >
                                    <InputText 
                                        value={values.password}
                                        onChange={(val) => setFieldValue("password", val)}
                                        type="password"
                                    />
                                </FormItem>
                                <FormItem
                                    label={getLocalizedString("FieldsPasswordConfirm", lang)}
                                    required
                                    help={errors.confirmPassword}
                                    status={errors.confirmPassword ? "error" : undefined}
                                >
                                    <InputText 
                                        value={values.confirmPassword}
                                        onChange={(val) => setFieldValue("confirmPassword", val)} 
                                        type="password"
                                    />
                                </FormItem>
                                <div>
                                    <Button 
                                        type="primary" 
                                        loading={submitting}
                                        onMouseDown={() => {
                                            submitForm();
                                        }}
                                    >{getLocalizedString("ResetPasswordText", lang)}</Button>
                                </div>
                                <div className="py-4">
                                    <div>
                                        {getLocalizedString("AlreadyHaveAnAccountText", lang)} <Link href="/auth/signin"><a>{getLocalizedString("SignInText", lang)}</a></Link>
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

const ResetPasswordContainer: NextPage<{ accountId: string, resetCode: string }> = ({ accountId, resetCode }) => {
    return (
        <LayoutWithoutAuth>
            <ResetPassword 
                accountId={accountId ? parseInt(accountId as string) : 0}
                resetCode={resetCode as string}
            />
        </LayoutWithoutAuth>
    )
}

ResetPasswordContainer.getInitialProps = async (props: unknown) => {
    const { accountId, resetToken } = (props as { query: {[key: string]: unknown }}).query;

    return {
        accountId: accountId as string,
        resetCode: resetToken as string,
    }
}

export default ResetPasswordContainer;