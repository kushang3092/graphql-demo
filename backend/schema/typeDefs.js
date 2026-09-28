const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    provider: String
    avatar: String
    createdAt: String
  }

  type Expense {
    id: ID!
    userId: ID!
    amount: Float!
    category: String
    description: String
    date: String
    receiptUrl: String
    createdAt: String
    user: User
  }

  type Query {
    users: [User!]!
    user(id: ID!): User

    expenses: [Expense!]!
    expense(id: ID!): Expense
  }
`;

export default typeDefs;
