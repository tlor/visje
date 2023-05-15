import { gql } from "apollo-boost";
export const login = gql`
  query login($input: LoginInput!) {
    login(input: $input) {
      user {
        _id
        username
        displayName
        password
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
