import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";

const prisma = new PrismaClient();

const typeDefs = ` #graphql 
type Place {
    id: ID!
    name: String
    prefectureId: Int
  }

  type Prefecture {
    id: ID!
    name: String
  }
  
  type Query {
    places:[Place]
    prefectures: [Prefecture]
  }
`;

const getPlaces = async () => {
  // ベタ書きPlace データ
  const placesData = [
    { id: 1, name: "鹿児島港", prefectureId: 1 },
    { id: 2, name: "東京港", prefectureId: 2 },
  ];

  return placesData;
};

const resolvers = {
  Query: {
    places: async () => {
      const placesData = await getPlaces();
      return placesData;
    },
    prefectures: async () => {
      const prefecturesData = await prisma.prefecture.findMany();
      return prefecturesData;
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
