import { gql } from "@apollo/client";

// Define your GraphQL mutation
export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      reservation {
        id
        name
      }
    }
  }
`;

export const UPDATE_RESERVATION = gql`
  mutation UpdateCommand($documentId: ID!, $data: CommandInput!) {
  updateCommand(documentId: $documentId, data: $data) {
    documentId
  }
}
`;

export const DELETE_RESERVATION = gql`
  mutation DeleteReservation($id: ID!) {
    deleteReservation(id: $id) {
      success
      message
    }
  }
`;