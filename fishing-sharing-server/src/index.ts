import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";

const typeDefs = `
type Prefecture {
    id: Int
    name: String
    placeId: Int
  }
  
  type Query {
    places: [Place]
  }

  type Mutation {
    DummyData: String
  }
`;

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    places: async () => {
      return await prisma.prefectures.findMany();
    },
  },
  Mutation: {
    DummyData: async () => {
      await prisma.prefectures.createMany({
        data: [
          { placeId: 1, name: "Dummy 1" },
          { placeId: 2, name: "Dummy 2" },
        ],
      });
    },
  },
};
export default resolvers;

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(
  "/",
  cors({
    origin: ["http://localhost:3000"],
  }),
  express.json(),
  expressMiddleware(server)
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);
console.log(`🚀 Server ready at http://localhost:4000`);
