import { NextPage } from "next";

// containers
import LayoutWithAuth from '../../containers/LayoutWithAuth';

// forms
import OrganizationDetailsForm from '../../containers/OrganizationForms/OrganizationDetailsForm';
import ContactDetailsForm from "../../containers/OrganizationForms/ContactDetailsForm";
import BankDetailsForm from "../../containers/OrganizationForms/BankDetailsForm";
import LocationDetailsForm from "../../containers/OrganizationForms/LocationDetailsForm";

// components
import { Tabs } from "../../components/Tabs";

// styles
import styles from '../../styles/Home.module.css'

const EditOrganization: NextPage = () => {
    return(
        <div className={styles.container} style={{ width: "100%" }}>
            <div className="py-2">
                <h2 className="text-2xl font-bold">Edit Organization</h2>
                <Tabs 
                    tabs={[
                        {
                            title: "Organization Details",
                            component: <OrganizationDetailsForm />
                        },
                        {
                            title: "Locations",
                            component: <LocationDetailsForm />
                        },
                        {
                            title: "Contact Details",
                            component: <ContactDetailsForm />
                        },
                        {
                            title: "Bank Details",
                            component: <BankDetailsForm />
                        }
                    ]}
                />
            </div>
        </div>
    )
}

const EditOrganizationPage: NextPage = () => (
    <LayoutWithAuth>
        <EditOrganization />
    </LayoutWithAuth>
);

export default EditOrganizationPage;
