import { ApolloServer } from '@apollo/server'
import { PrismaClient } from '@prisma/client'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import createPlace from './lib/createPlace'
import createFishLog from './lib/createFishlogs'
import deletePlace from './lib/deletePlace'
import deleteFishLog from './lib/deleteFishlog'
import express from 'express'
import http from 'http'
import cors from 'cors'
import updatePlace from './lib/updatePlace'

const prisma = new PrismaClient()

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

  type FishLogs {
    id: ID!
    placeId: Int
    placeName:String
    date: String
    fishName: String
  }

  type FishLog {
    id: ID!
    placeId: Int
    placeName:String
    date: String
    image: String
    fishName: String
    isSunny: Boolean
    isRainy: Boolean
    isCloudy: Boolean
    size: Int
    tide: String
  }
  
  input CreatePlace {
    name: String
    prefectureId: Int
  }

  input CreateFishLog{
    placeId:Int
    date: String
    image: String
    fishName: String
    isSunny: Boolean
    isRainy: Boolean
    isCloudy: Boolean
    size: Int
    tide: String
  }

  type InputPlace{
    id: ID!
    name:String
    prefectureId:Int
  }

  type InputFishLog{
    id: ID!
    placeId:Int
    date: String
    image: String
    fishName: String
    isSunny: Boolean
    isRainy: Boolean
    isCloudy: Boolean
    size: Int
    tide: String
  }

  input DeletePlace {
    id:ID
  }

  input DeleteFishLog {
    id:ID
  }

  input EditPlace {
    id: ID
    name: String
    prefectureId:Int
  }

  type Query {
    getPlace(id:Int!): Place
    getAllPlaces:[Place]
    prefectures: [Prefecture]
    getFishLog(id:Int): FishLog
    getFishLogs(placeId: Int): [FishLogs]
  }

  type Mutation {
    createPlace(create:CreatePlace):InputPlace
    createFishLog(create:CreateFishLog):InputFishLog
    deletePlace(delete:DeletePlace):Place
    deleteFishLog(delete:DeleteFishLog):FishLog
    updatePlace(edit:EditPlace):Place
  }

`

const resolvers = {
  Query: {
    getAllPlaces: async () => {
      const placesData = await prisma.place.findMany({
        //inclodeは全てのplaceデータ＋リレーションしているprefectureのnameを含ませることができる
        include: {
          prefecture: {
            select: {
              name: true,
            },
          },
        },
      })
      //取得したデータをGraphQLレスポンスで返す前に変換する
      return placesData.map((place) => {
        return {
          id: place.id,
          name: place.name,
          // 関連するprefectureから'name'を抽出する。
          prefecture: place.prefecture.name,
        }
      })
    },
    getPlace: async (_, { id }) => {
      const placeData = await prisma.place.findUnique({
        //特定の場所のデータを取得
        where: {
          id: id,
        },
        // prefectureを含ませる
        include: {
          prefecture: {
            select: {
              name: true,
            },
          },
        },
      })
      return {
        id: placeData.id,
        name: placeData.name,
        prefecture: placeData.prefecture.name,
      }
    },
    prefectures: async () => {
      //dbからデータを取得し (Prisma を使用してデータベースと対話し)て、「都道府県」テーブルからデータをフェッチするのをまつ
      const prefecturesData = await prisma.prefecture.findMany()
      //そのデータを返す
      return prefecturesData
    },
    getFishLogs: async (_, { placeId }) => {
      const fishLogs = await prisma.fishLog.findMany({
        where: {
          placeId: placeId, // 指定された placeId に一致するすべての FishLog を取得
        },
        include: {
          place: {
            select: {
              name: true,
            },
          },
        },
      });
    
      // 取得したデータをGraphQLレスポンスで返す前に変換する
      return fishLogs.map((fishLog) => ({
        id: fishLog.id,
        placeId: fishLog.placeId,
        placeName: fishLog.place.name,
        date: fishLog.date,
        fishName: fishLog.fishName,
      }));
    },
    
    getFishLog: async (_, {id }) => {
      const fishLogs = await prisma.fishLog.findUnique({
        where: {
          id: id,
        },
        include: {
          place: {
            select: {
              name: true,
            },
          },
        },
      });
    
      return {
        id: fishLogs.id,
        placeId: fishLogs.placeId,
        placeName:fishLogs.place.name,
        date: fishLogs.date,
        image: fishLogs.image,
        fishName: fishLogs.fishName,
        isSunny: fishLogs.isSunny,
        isRainy: fishLogs.isRainy,
        isCloudy: fishLogs.isCloudy,
        size: fishLogs.size,
        tide: fishLogs.tide,
      };
    }},

  //データ更新
  Mutation: {
    //指定した引数を受け取ったら(apollo特有で第一引数になんかいて、第一引数は使わないから、_:anyって書く)
    createPlace: async (_: any, { create: { name, prefectureId } }) => {
      return await createPlace(name, prefectureId)
    },
    createFishLog: async (
      _: any,
      {
        create: {
          placeId,
          date,
          image,
          fishName,
          isSunny,
          isRainy,
          isCloudy,
          size,
          tide,
        },
      },
    ) => {
      return await createFishLog(
        placeId,
        date,
        image,
        fishName,
        isSunny,
        isRainy,
        isCloudy,
        size,
        tide,
      )
    },
    deletePlace: async (_: any, { delete: { id } }) => await deletePlace(id),
    deleteFishLog: async (_: any, { delete: { id } }) => await deleteFishLog(id),
    updatePlace: async (_: any, { edit: { id, name, prefectureId } }) =>
      await updatePlace(id, name, prefectureId),
}}

export default resolvers

const app = express()
const httpServer = http.createServer(app)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})
await server.start()

app.use(
  '/',
  cors({
    origin: ['http://localhost:3000'],
  }),
  express.json(),
  expressMiddleware(server),
)

await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve))

console.log(`🚀 Server ready at http://localhost:4000`)
