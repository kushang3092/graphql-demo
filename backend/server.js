import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import typeDefs from "./schema/typeDefs.js";
import resolvers from "./schema/resolvers.js";

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "test";

if (!MONGO_URI) {
  console.error("Missing MONGO_URI in .env");
  process.exit(1);
}

async function start() {
  // 1. Connect to MongoDB (Atlas cluster, "test" database, "users" collection)
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  console.log(`✅ Connected to MongoDB Atlas — db: "${DB_NAME}"`);

  // 2. Set up Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();

  // 3. Set up Express app
  const app = express();
  const FRONTEND_URL = process.env.FRONTEND_URL; // e.g. https://your-app.vercel.app
  app.use(
    cors({
      origin: FRONTEND_URL || "*", // "*" for local dev when FRONTEND_URL isn't set
    })
  );
  app.use(bodyParser.json());

  app.use("/graphql", expressMiddleware(server));

  app.get("/", (_req, res) => {
    res.send("GraphQL demo backend is running. Visit /graphql to query.");
  });

  app.get("/health", (_req, res) => {
    res.send("ok");
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
