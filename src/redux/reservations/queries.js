import { gql } from "@apollo/client";

// Define your GraphQL query
// export const GET_COMMANDS = gql`
//  query Commands($filters: CommandFiltersInput, $pagination: PaginationArg) {
//   commands(filters: $filters, pagination: $pagination) {
//     company_id {
//       name
//     }
//     dropOfAddress {
//       Address
//     }
//     pickUpAddress {
//       Address,coordonne {
//         latitude,longitude
//       }
//     }
//   }
// }`;

export const GET_RESERVATION_BY_ID = gql`
  query GetReservationById($id: ID!) {
    reservation(id: $id) {
      id
      name
      status
    }
  }
`;

export const GET_RESERVATIONS = gql`
  query Commands_connection(
    $filters: CommandFiltersInput
    $pagination: PaginationArg
    $sort: [String]
  ) {
    commands_connection(filters: $filters, pagination: $pagination, sort: $sort) {
      nodes {
        createdAt
        updatedAt
        documentId
        refNumber
        payType
       
        dropOfAddress {
          Address
        }
        pickUpAddress {
          Address
          coordonne {
            latitude
            longitude
          }
        }
        duration
        distance

        totalPrice
        commandStatus
        departDate
        deparTime
        driver {
          documentId
          firstName
          lastName
        }
        client {
          documentId
          username
          firstName
          lastName
          email
          phoneNumber
          profilePicture {
            url
          }
        }
        isAccepted
        publishedAt
      }
      pageInfo {
        total
        page
        pageSize
        pageCount
      }
    }
  }
`;

export const GET_RESERVATIONS_COUNT = gql`
  query Commands_connection($filters: CommandFiltersInput) {
    commands_connection(filters: $filters) {
      pageInfo {
        total
      }
    }
  }
`;


export const GET_COMMAND_DETAILS_BY_ID = gql`
  query Command($documentId: ID!) {
  command(documentId: $documentId) {
    documentId
    deparTime
    departDate
    commandStatus
    refNumber
    duration
    cancelReason
    distance
    totalPrice
    payType
    createdAt
    updatedAt
   carType
    pickUpAddress {
      Address
      coordonne {
        latitude
        longitude
      }
    }
    
    dropOfAddress {
      Address
      coordonne {
        latitude
        longitude
      }
    }
   
    client {
      documentId
      firstName
      lastName
      email
      phoneNumber
      profilePicture {
        url
        formats
      }
    }
    driver {
      documentId
      location {
        address
        latitude
        longitude
        updatedAt
      }
      email
      firstName
      lastName
      rating
      phoneNumber
      profilePicture {
        formats
        url
      }
      vehicule {
        documentId
        color
        model
        mark
        matriculation
        year
        vehiculePictureface1 {
          formats
          url
        }
        vehiculePictureface2 {
          formats
          url
        }
        vehiculePictureface3 {
          formats
          url
        }
        vehiculePictureface4 {
          formats
          url
        }

      }
    }
  
  }
}
`;