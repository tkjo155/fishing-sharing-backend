import { ApolloServer } from "@apollo/server";
import { PrismaClient } from "@prisma/client";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import createPlace from "./lib/createPlace";
import express from "express";
import http from "http";
import cors from "cors";

const prisma = new PrismaClient();

const typeDefs = ` #graphql 
type Place {
    id: ID!
    name: String
    prefecture:String
  }

  type Prefecture {
    id: ID!
    name: String
  }
  
  type Query {
    places:[Place]
    prefectures: [Prefecture]
  }

  input CreatePlace {
    name: String
    prefectureId: Int
  }

  type InputPlace{
    id: ID!
    name:String
    prefectureId:Int
  }

  type Mutation {
    createPlace(create:CreatePlace):InputPlace
  }

`;

const resolvers = {
  Query: {
    places: async () => {
      const placesData = await prisma.place.findMany({
        //inclodeは全てのplaceデータ＋リレーションしているprefectureのnameを含ませることができる
        include: {
          prefecture: {
            select: {
              name: true,
            },
          },
        },
      });
      //取得したデータをGraphQLレスポンスで返す前に変換する
      return placesData.map((place) => {
        return {
          id: place.id,
          name: place.name,
          // 関連するprefectureから'name'を抽出する。
          prefecture: place.prefecture.name,
        };
      });
    },
    prefectures: async () => {
      const prefecturesData = await prisma.prefecture.findMany();
      return prefecturesData;
    },
  },
  //データ更新
  Mutation: {
    //指定した引数を受け取ったら(apollo特有で第一引数になんかいて、第一引数は使わないから、_:anyって書く)
    createPlace: async (_: any, { create: { name, prefectureId } }) => {
      //createPlace関数にその引数を渡してあげる
      const createdPlace = await createPlace(name, prefectureId);
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
