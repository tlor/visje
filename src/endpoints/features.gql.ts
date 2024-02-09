import { gql } from "apollo-boost";

export const features = gql`
  query features {
    getFeatures {
      features {
        onboarding {
          avatar
          study
          check
          groups
        }
        homepage {
          events
          messages
          posts {
            flag
          }
        }
        groups {
          groupEdit {
            members
            roles
          }
        }
        members {
          memberlist
          profileEdit
          profile          
        }
        notifications {
          badge
        }
        events {
          types
        }
      }
    }
  }
`;