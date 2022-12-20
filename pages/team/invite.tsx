import type { NextPage } from 'next';
import { Form, Formik, FormikErrors } from 'formik';
import isEmail from "validator/lib/isEmail";
import { useMutation, ApolloError } from '@apollo/client';
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import { useContext } from 'react';

// containers
import LayoutWithAuth from '../../containers/LayoutWithAuth';

// components
import { FormItem } from '../../components/Form';
import Button from '../../components/Button';
import { InputText } from '../../components/Input';
import { Select } from "../../components/Select";

// localized
import { LanguageContext, retrieveLocalizedString } from "../../localize";

// styles
import styles from '../../styles/Home.module.css';

// queries and mutation
import { TeamMutations } from "../../queries/team.queries";

interface TeamInviteInput{
    firstName: string;
    lastName: string;
    email: string;
    userRoles: number[];
}

const TeamInvite: NextPage = () => {
    const { language } = useContext(LanguageContext);
    const { push } = useRouter();

    const [ inviteTeamMember, { loading: submitting }] = useMutation(TeamMutations.inviteTeamMember);
    
    return (
        <div className={styles.container}>
            <div className="py-8">
                <h3 className="text-2xl font-bold">{retrieveLocalizedString(language, "TeamInviteHeading")}</h3>
                <p className="py-2">{retrieveLocalizedString(language, "TeamInviteDescription")}</p>
            </div>
            <div>
                <Formik
                    initialValues={{
                        userRoles: [1],
                    } as TeamInviteInput}
                    onSubmit={async (values) => {
                        try {
                            const resp = await inviteTeamMember({ 
                                variables: { 
                                    data: values,
                                } 
                            });
                            push("/team");
                        } catch (e) {
                            let parsedErrors = (e as ApolloError).graphQLErrors;
                            const messages = parsedErrors.map((err) => err.message);

                            for (let message of messages) {
                                toast.error(message);
                            }
                        }
                    }}
                    validate={(values) => {
                        const errors: FormikErrors<TeamInviteInput> = {};

                        if (!values.firstName) errors.firstName = retrieveLocalizedString(language, "TeamInviteFirstNameRequired");
                        if (!values.lastName) errors.lastName = retrieveLocalizedString(language, "TeamInviteLastNameRequired");

                        if (!values.email) errors.email = retrieveLocalizedString(language, "TeamInviteEmailRequired");
                        else if (!isEmail(values.email)) errors.email = retrieveLocalizedString(language, "TeamInviteEmailInvalid");

                        return errors;
                    }}
                >
                    {({ values, errors, setFieldValue, submitForm }) => (
                        <div>
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
                                label={retrieveLocalizedString(language, "FieldsUserRole")}
                                required
                            >
                                <Select 
                                    onChange={(val) => setFieldValue("userRoles", val)}
                                    value={values.userRoles}
                                    options={[
                                        {
                                            label: "Admin",
                                            value: [1]
                                        },{
                                            label: "User",
                                            value: [2]
                                        },
                                    ]}
                                />
                            </FormItem>
                            <div>
                                <Button 
                                    type="primary" 
                                    onMouseDown={() => {
                                        submitForm();
                                    }}
                                    loading={submitting}
                                >{retrieveLocalizedString(language, "TeamInviteSubmitButton")}</Button>
                            </div>
                        </div>
                    )}
                </Formik>
            </div>
        </div>
    )
}

const TeamInvitePage = () => (
    <LayoutWithAuth>
        <TeamInvite />
    </LayoutWithAuth>
)

export default TeamInvitePage;