import { gql } from "@apollo/client";

export const GET_EXPENSES = gql`
  query GetExpenses {
    expenses {
      id
      amount
      category
      description
      date
      receiptUrl
      createdAt
      user {
        id
        name
        email
      }
    }
  }
`;
