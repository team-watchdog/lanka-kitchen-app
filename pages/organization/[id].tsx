import { FunctionComponent } from "react";
import { NextPage } from "next";
import { gql } from "@apollo/client";
import { useRouter } from 'next/router';


import { getClientWithAuth } from "../../api/clientWithAuth";

import { useAuth } from "../../lib/auth";

// containers
import LayoutWithoutAuth from '../../containers/LayoutWithoutAuth';
import FullOrganization from '../../containers/FullOrganization';

// types
import { Organization } from "../../types/organization.type";

const Queries = {
    GET_ORGANIZATION_DETAILS: gql`
        query GetOrganization($id: Int!) {
            getOrganization(id: $id) {
                id
                name
                summary
            }
        }
    `,
}

interface PageWithContextProps{
    organization: Partial<Organization>;
}

const PageWithContext: FunctionComponent<PageWithContextProps> = ({ organization }: PageWithContextProps) => {
    if (!organization || !organization.id) return null;
    const { organizationId } = useAuth();
    const router = useRouter();
    
    if (organizationId === organization.id) {
        router.push('/organization');
    }

    return (
        <FullOrganization 
            organizationId={organization.id} 
            editAccess={false}
        />
    )
}

interface OrganizationPageProps{
    organization: Partial<Organization>;
}

const OrganizationPage: NextPage<OrganizationPageProps> = ({ organization }: OrganizationPageProps) => {
    return (
        <LayoutWithoutAuth noRedirect>
            <PageWithContext organization={organization} />
        </LayoutWithoutAuth>
    )
}


export async function getServerSideProps({ params }: { params: { id: string } }) {
    const organizationId = params.id ? parseInt(params.id) : null;
    let organization = null;

    try {
        const resp = await getClientWithAuth(null).query({
            query: Queries.GET_ORGANIZATION_DETAILS,
            variables: {
                id: organizationId
            }
        });

        if (resp.data.getOrganization) {
            organization = resp.data.getOrganization;
        }
    } catch (e) {
        console.log(e);
    }

    return {
        props: {
            organization,
        },
    }
}

export default OrganizationPage;