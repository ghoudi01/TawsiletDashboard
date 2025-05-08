import { gql } from "@apollo/client";

// Define your GraphQL query
export const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      name
      description
    }
  }
`;

export const GET_ITEM_BY_ID = gql`
  query GetItemById($id: ID!) {
    item(id: $id) {
      id
      name
      description
    }
  }
`;
