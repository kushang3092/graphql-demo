import User from "../models/User.js";
import Expense from "../models/Expense.js";

const resolvers = {
  Query: {
    users: async () => {
      const users = await User.find().sort({ createdAt: -1 });
      return users;
    },
    user: async (_parent, { id }) => {
      return await User.findById(id);
    },

    expenses: async () => {
      const expenses = await Expense.find().sort({ date: -1 });
      return expenses;
    },
    expense: async (_parent, { id }) => {
      return await Expense.findById(id);
    },
  },

  // Map Mongo's _id -> GraphQL's id, and Date -> String
  User: {
    id: (parent) => parent._id?.toString() ?? parent.id,
    createdAt: (parent) =>
      parent.createdAt ? new Date(parent.createdAt).toISOString() : null,
    expenses : async(parent)=>{
      const expenses = await Expense.find({userId:parent._id});
      console.log("expenses",expenses);
      
      return expenses;
    }
  },

  Expense: {
    id: (parent) => parent._id?.toString() ?? parent.id,
    userId: (parent) => parent.userId?.toString(),
    date: (parent) =>
      parent.date ? new Date(parent.date).toISOString() : null,
    createdAt: (parent) =>
      parent.createdAt ? new Date(parent.createdAt).toISOString() : null,
    // Resolves the related User document from the expense's userId,
    // so a client can ask for `expenses { amount user { name email } }`
    user: async (parent) => {
      return await User.findById(parent.userId);
    },
  },
};

export default resolvers;
