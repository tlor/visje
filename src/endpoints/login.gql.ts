import { gql } from "apollo-boost";
export const resetPassword = gql`
  mutation resetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
    }
  }
`;
export const login = gql`
  query login($input: LoginInput!) {
    login(input: $input) {
      user {
        _id
        username
        displayName
        email
        role
        avatar
      }
      token
      member {
        _id
        meta {
        _id
        memberMeta {
          _id
          since
          group
          motto
          description
        }
        study {
          _id
          school
          course
          year
          }
        }
      }
      groups {
        _id
        name
        icon
        color
        roles {
          member {
            _id
          }
          role
        }
      }
    }
  }
`;
