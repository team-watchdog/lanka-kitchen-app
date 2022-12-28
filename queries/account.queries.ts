import { gql } from "@apollo/client"

export const AccountQueries = {
    getMe: gql`
        query getMe {
            me{
                id
                firstName
                lastName
                email
                userRoles
                permissions
                organization {
                    id
                    approved
                }
            }
        }
    `,
}