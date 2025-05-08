import { gql } from "@apollo/client";

// Define your GraphQL mutation
export const ADD_ITEM = gql`
  mutation AddItem($name: String!, $description: String!) {
    addItem(input: { name: $name, description: $description }) {
      id
      name
      description
    }
  }
`;

export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: ID!, $name: String!, $description: String!) {
    updateItem(id: $id, input: { name: $name, description: $description }) {
      id
      name
      description
    }
  }
`;
