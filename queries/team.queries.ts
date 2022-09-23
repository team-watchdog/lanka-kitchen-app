import { gql } from "@apollo/client";

export const TeamMutations = {
    inviteTeamMember: gql`
        mutation InviteTeamMember($data: InviteTeamMemberInput!) {
            inviteTeamMember(data: $data) {
                id
            }
        }
    `,
    deleteInvite: gql`
        mutation DeleteInvite($data: DeleteInviteInput!) {
            deleteInvite(data: $data)
        }
    `,
    resendInvite: gql`
        mutation ResendInvite($data: ResendInviteInput!) {
            resendInvite(data: $data)
        }
    `,
}

export const TeamQueries = {
    getTeam: gql`
        query GetTeam {
            team {
                id
                firstName
                lastName
                email
                userRoleDefs {
                    label
                    id
                }
                userRoles
                isActive
            }
            invitations {
                id
                firstName
                lastName
                email
                userRoleDefs {
                    label
                    id
                }
                userRoles
            }
        }
    `
}