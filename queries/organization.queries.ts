import { gql } from "@apollo/client"

export const OrganizationQueries = {
    GET_ORGANIZATION: gql`
        query GetOrganization{
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
}