// This file is autogenerated by tlor, remove this line before making edits. Any changes will otherwise be lost
import { gql } from "apollo-boost";

export const eventById = gql`
  query eventById($id: MongoID!) {
    eventById(_id: $id) {
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
      poster
      from
      to
      location {
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
      tags
      organiser {
        _id
        organiser
        avatar
        member {
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
        group {
          _id
          name
          icon
          color
          members {
            _id
          }
          roles {
            _id
          }
        }
      }
    }
  }
`;

export const eventMany = gql`
  query eventMany($filter: FilterFindManyEventInput!) {
    eventMany(filter: $filter) {
      _id
      title
      content
      author {
        user {
          displayName
          avatar
        }
      }
      likes {
        _id
        members {
          _id
          user {
            displayName
            avatar
          }
        }
        type
      }
      statistics {
        _id
        type
        data
      }
      poster
      type
      from
      to
      location {
        _id
        shortName
        longName
        location
        street
        number
        postalcode
        city
      }
      tags
      organiser {
        _id
        organiser
        avatar
        member {
          _id
          user {
            avatar
            displayName
          }
        }
        group {
          _id
          name
          icon
          color
        }
      }
    }
  }
`;