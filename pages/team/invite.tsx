import type { NextPage } from 'next';
import { Form, Formik, FormikErrors } from 'formik';
import isEmail from "validator/lib/isEmail";
import { useMutation, ApolloError } from '@apollo/client';
import { useRouter } from "next/router";
import { toast } from 'react-toastify';

// containers
import LayoutWithAuth from '../../containers/LayoutWithAuth';

// components
import { FormItem } from '../../components/Form';
import Button from '../../components/Button';
import { InputText } from '../../components/Input';
import { Select } from "../../components/Select";

// localized
import { useLocale } from "../../localize";

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
    const { getLocalizedString } = useLocale();
    const { push } = useRouter();

    const [ inviteTeamMember, { loading: submitting }] = useMutation(TeamMutations.inviteTeamMember);
    
    return (
        <div className={styles.container}>
            <div className="py-8">
                <h3 className="text-2xl font-bold">{getLocalizedString("TeamInviteHeading")}</h3>
                <p className="py-2">{getLocalizedString("TeamInviteDescription")}</p>
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

                        if (!values.firstName) errors.firstName = getLocalizedString("TeamInviteFirstNameRequired");
                        if (!values.lastName) errors.lastName = getLocalizedString("TeamInviteLastNameRequired");

                        if (!values.email) errors.email = getLocalizedString("TeamInviteEmailRequired");
                        else if (!isEmail(values.email)) errors.email = getLocalizedString("TeamInviteEmailInvalid");

                        return errors;
                    }}
                >
                    {({ values, errors, setFieldValue, submitForm }) => (
                        <div>
                            <FormItem
                                label={getLocalizedString("FieldsFirstName")}
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
                                label={getLocalizedString("FieldsLastName")}
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
                                label={getLocalizedString("FieldsEmail")}
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
                                label={getLocalizedString("FieldsUserRole")}
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
                                >{getLocalizedString("TeamInviteSubmitButton")}</Button>
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