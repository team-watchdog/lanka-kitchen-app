import { NextPage } from "next";
import { gql, useQuery } from "@apollo/client";

// containers
import LayoutWithoutAuth from "../containers/LayoutWithoutAuth";

// components
import { InputText } from "../components/Input";

// partials
import { OrganizationItem } from "../partials/OrganizationItem";
import Map from "../components/Map";

// styles
import styles from '../styles/Home.module.css';
import { Organization } from "../types/organization.type";
import { Loading } from "../components/Loading";
import { FunctionComponent } from "react";


interface GetOrganizationData{
    getOrganizations: Organization[];
}

const Queries = {
    GET_ORGANIZATIONS: gql`
        query GetOrganizations{
            getOrganizations {
                id
                name
                summary
                description
                assistanceTypes
                assistanceFrequency
                peopleReached
                profileImageUrl
                locations{
                    placeId
                    formattedAddress
                    district
                    province
                    geo{
                        lat
                        lon
                    }
                }
                bankName
                accountNumber
                accountName
                accountType
                branchName
                notes
                phoneNumbers
                email
                website
                instagram
                facebook
                twitter
                paymentLink
            }
        }
    `,
}

const DirectoryContainer: FunctionComponent = () => {
    const { data, loading } = useQuery<{ getOrganizations: Organization[]}>(Queries.GET_ORGANIZATIONS);

    if (loading) return <Loading />

    return (
        <div className="h-screen flex-row pb-4">
            <div className="flex">
                <InputText 
                    placeholder="Search for organizations"
                    value=""
                    onChange={(value) => {
                    }}
                />
            </div>
            <div className="py-4 grid grid-cols-6 gap-2 h-full flex-1">
                <div className="col-span-2 p-2 bg-slate-50 rounded-md">
                    <div className="py-2">
                        {data?.getOrganizations.map((organization, i) => (
                            <OrganizationItem organization={organization} key={i} />
                        ))}
                    </div>
                </div>
                <div className="col-span-4 bg-indigo-100 rounded-md overflow-hidden">
                    <Map 
                        
                    />
                </div>
            </div>
        </div>
    )
}

const DirectoryPage: NextPage = () => {

    return (
        <LayoutWithoutAuth>
            <div className={styles.container} style={{ paddingTop: "1rem" }}>
                <DirectoryContainer />
            </div>
        </LayoutWithoutAuth>
    )
}

export default DirectoryPage;