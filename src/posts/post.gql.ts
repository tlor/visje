import { gql } from "apollo-boost";

export const postMany = gql`
  query postMany($filter: FilterFindManyPostInput!) {
    postMany(filter: $filter) {
      _id
      title
      content
      author {
        _id
        user {
          _id
          username
          displayName
          password
          email
          role
          avatar
        }
        name
        middleName
        surname
        gender
        fullName
        birthdate
        address {
          _id
          shortName
          longName
          location
          street
          number
          postalcode
          city
          phone
        }
        meta {
          _id
          memberMeta {
            _id
          }
          study {
            _id
          }
        }
      }
      likes {
        _id
        members {
          _id
          user {
            _id
          }
          name
          middleName
          surname
          gender
          fullName
          birthdate
          address {
            _id
          }
          meta {
            _id
          }
        }
        type
      }
      statistics {
        _id
        type
        data
      }
      comments {
        _id
        posts {
          _id
          title
          content
          author {
            _id
          }
          likes {
            _id
          }
          statistics {
            _id
          }
          comments {
            _id
          }
        }
      }
      embeds {
        _id
        EmbedUrl
        type
      }
      pinned
    }
  }
`;
