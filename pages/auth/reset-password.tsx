import { Formik } from "formik";
import { NextPage } from "next";
import Link from "next/link";

// containers
import LayoutWithoutAuth from "../../containers/LayoutWithoutAuth";

// components
import { FormItem } from "../../components/Form";
import Button from "../../components/Button";
import { InputText } from "../../components/Input";

// localized
import { getLocalizedString } from "../../localize";

const ResetPassword: NextPage = () => {
    const lang = "en";

    return (
        <div>
            <div className="container max-w-screen-md m-auto">
                <div className="py-8">
                    <h3 className="text-2xl font-bold">{getLocalizedString("ResetPasswordHeading", lang)}</h3>
                </div>
                <div>
                    <Formik
                        initialValues={{
                            
                        }}
                        onSubmit={(values) => {

                        }}
                    >
                        {() => (
                            <div>
                                <FormItem
                                    label={getLocalizedString("FieldsPassword", lang)}
                                >
                                    <InputText 
                                        value="" 
                                        type="email"
                                    />
                                </FormItem>
                                <FormItem
                                    label={getLocalizedString("FieldsPasswordConfirm", lang)}
                                >
                                    <InputText 
                                        value="" 
                                        type="email"
                                    />
                                </FormItem>
                                <div>
                                    <Button type="primary" onMouseDown={() => {}}>{getLocalizedString("ResetPasswordText", lang)}</Button>
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

const ResetPasswordContainer = () => (
    <LayoutWithoutAuth>
        <ResetPassword />
    </LayoutWithoutAuth>
)

export default ResetPasswordContainer;