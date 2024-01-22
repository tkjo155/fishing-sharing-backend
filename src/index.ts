import { ApolloServer } from "@apollo/server";
import { Prisma, PrismaClient } from "@prisma/client";
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

// createPlace 関数
async function createPlace() {
  try {
    // 既存の Prefecture レコードを取得
    const existingPrefecture = await prisma.prefecture.findFirst();
    // Place テーブルにデータを挿入
    const createdPlace = await prisma.place.create({
      data: {
        name: "鹿児島港",
        prefectureId: existingPrefecture.id,
      },
    });
    return createdPlace;
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

createPlace();

const resolvers = {
  Query: {
    //Prefecture データを取得し、それを返す
    prefectures: async () => {
      const prefecturesData = await prisma.prefecture.findMany();
      return prefecturesData;
    },
    places: async () => {
      const createdPlace = await createPlace();
      // createPlaceで作成したデータを取得
      const placesData = await prisma.place.findMany();
      return placesData;
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
