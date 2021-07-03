import { gql } from "@apollo/client";

export const ADD_PRODUCT = gql`
  mutation ADD_PRODUCT(
    $name: String!
    $price: Int!
    $quantity: Int!
    $alc: Float!
    $img: String!
    $category: String!
  ) {
    addProduct(
      name: $name
      price: $price
      quantity: $quantity
      alc: $alc
      img: $img
      category: $category
    ) {
      name
    }
  }
`;

export const ADD_ADMIN = gql`
  mutation ADD_ADMIN($username: String!, $password: String!) {
    addAdmin(username: $username, password: $password) {
      username
    }
  }
`;

export const INCREMENT = gql`
  mutation INCREMENT($id: ID!) {
    increment(id: $id) {
      id
      name
      quantity
    }
  }
`;

export const DECREMENT = gql`
  mutation DECREMENT($id: ID!) {
    decrement(id: $id) {
      id
      name
      quantity
    }
  }
`;
