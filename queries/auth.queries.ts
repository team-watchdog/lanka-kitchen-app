import { gql } from "@apollo/client";

export const AuthMutations = {
    signUp: gql`
        mutation signUp($data: SignUpInput!) {
            signUp(data: $data) {
                token
                account {
                    id
                }
            }
        }
    `,
    signIn: gql`
        mutation signIn($data: SignInInput!) {
            signIn(data: $data) {
                token
                account {
                    id
                }
            }
        }
    `,
    forgotPassword: gql`
        mutation forgotPassword($data: ForgotPasswordInput!) {
            forgotPassword(data: $data) {
                success
            }
        }
    `,
}