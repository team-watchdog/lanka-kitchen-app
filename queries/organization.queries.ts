import { gql } from "@apollo/client"

export const OrganizationQueries = {
    GET_MY_ORGANIZATION: gql`
        query MyOrganization{
            me{
                organization{
                    id
                    locations{
                        placeId
                        formattedAddress
                    }
                }
            }
        }
    `,

    GET_ORGANIZATION: gql`
        query GetOrganization($id: Int!) {
            getOrganization(id: $id) {
                id
                locations{
                    placeId
                    formattedAddress
                }
            }
        }
    `,
}