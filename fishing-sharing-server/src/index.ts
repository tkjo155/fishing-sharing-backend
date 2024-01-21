import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";

const typeDefs = ` #graphql 
type Place {
    id: Int
    name: String
    placeId: Int
  }
  
  type Query {
    places:[Place]
  }

  type Mutation {
    DummyData:[Place]
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
      const createdData1 = await prisma.prefectures.create({
        data: { id: 100, name: "Dummy 1" },
      });
      const createdData2 = await prisma.prefectures.create({
        data: { id: 200, name: "Dummy 2" },
      });

      return [createdData1, createdData2];
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
