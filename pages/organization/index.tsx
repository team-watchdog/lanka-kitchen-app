import { FunctionComponent } from "react";
import { NextPage } from "next";
import { gql, useQuery } from "@apollo/client";

// containers
import LayoutWithAuth from '../../containers/LayoutWithAuth';
import FullOrganization from '../../containers/FullOrganization';

const Queries = {
    GET_ORGANIZATION_DETAILS: gql`
        query Organization{
            me{
                organization{
                    id
                }
            }
        }
    `,
}

const PageWithContext: FunctionComponent = () => {
    const { data } = useQuery(Queries.GET_ORGANIZATION_DETAILS);
    return data?.me?.organization ? <FullOrganization organizationId={data.me.organization.id} /> : null;
}

const OrganizationPage: NextPage = () => {
    return (
        <LayoutWithAuth>
            <PageWithContext />
        </LayoutWithAuth>
    )
}

export default OrganizationPage;