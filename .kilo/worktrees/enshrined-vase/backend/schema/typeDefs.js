const typeDefs = `#graphql

 type Query {
    users: [User!]!
    user(id: ID!): User

    expenses: [Expense!]!
    expense(id: ID!): Expense
  }

  type Mutation {
    addUser(user : userInput!):User
  }

  
  type User {
    id: ID!
    name: String!
    email: String!
    provider: String
    avatar: String
    createdAt: String
    expenses : [Expense]
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

  input userInput{
    name: String!
    email: String!
  }
  
`;

export default typeDefs;
