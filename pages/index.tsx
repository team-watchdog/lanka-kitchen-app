import { NextPage } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { LibraryIcon } from "@heroicons/react/solid";

// containers
import LayoutWithoutAuth from "../containers/LayoutWithoutAuth";

// partials
import { OrganizationItem } from "../partials/OrganizationItem";
import Map from "../components/Map";

// styles
import styles from '../styles/Home.module.css';
import { Organization } from "../types/organization.type";
import { Loading } from "../components/Loading";
import { FunctionComponent } from "react";
import { GeoJSONPoint } from "../types/geo.types";
import Button from "../components/Button";

// helpers
import { useAuth } from "../lib/auth";

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
    const { push } = useRouter();
    const { account } = useAuth();

    if (loading) return <Loading />;

    let markers: GeoJSONPoint[] = [];

    if (data) {
        for (let organization of data.getOrganizations) {
            if (organization.locations) {
                for (let location of organization.locations) {
                    markers.push({
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [location.geo.lon, location.geo.lat],
                        },
                        properties: {
                            organization,
                        }
                    });
                }
            }
        }
    }

    return (
        <div className="h-screen flex-row pb-4">
            {!account && (
                <div className="flex">
                    <div className="py-8 max-w-2xl">
                        <h1 className="text-3xl font-bold py-4">Connecting aid efforts with the communities they serve</h1>
                        <p>Watchdog Foodbank project is an effort to help community kitchens, ration support groups, and other mutual aid organizations run their operations more smoothly and garner support from their communities during this time of crisis.</p>
                        <div className="flex gap-x-2 gap-y-2 py-4 flex-wrap">
                            <Button type="default" onMouseDown={() => {
                                push("/auth/signup")
                            }}><LibraryIcon className="w-4 h-4" />Register your organization</Button>
                        </div>
                    </div>
                </div>
            )}
            {/*
                <div className="flex">
                    <InputText 
                        placeholder="Search for organizations"
                        value=""
                        onChange={(value) => {
                        }}
                    />
                </div> 
            */}
            <div className="grid grid-cols-6 gap-2 h-full flex-1">
                <div className="col-span-2 px-2 overflow-y-scroll">
                    <div>
                        {data?.getOrganizations.map((organization, i) => (
                            <OrganizationItem 
                                organization={organization} 
                                key={i} 
                            />
                        ))}
                    </div>
                </div>
                <div className="col-span-4 bg-indigo-100 rounded-md overflow-hidden">
                    <Map 
                        markers={markers}
                        boundingBox={[
                            79.6951668639, 5.96836985923, 81.7879590189, 9.82407766361,
                        ]}
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