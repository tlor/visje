import { gql } from "apollo-boost";

export const features = gql`
  query features {
    getFeatures {
      features {
        onboarding {
          avatar
        }
        homepage {
          messages
        }
      }
    }
  }
`;