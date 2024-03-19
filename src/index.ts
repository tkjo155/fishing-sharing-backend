import { ApolloServer } from '@apollo/server'
import { PrismaClient } from '@prisma/client'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import createPlace from './lib/createPlace'
import createFishLog from './lib/createFishlogs'
import express from 'express'
import http from 'http'
import cors from 'cors'

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

  type FishLog {
    id: ID!
    placeId: Int
    placeName:String
    date: String
    image: String
    fishName: String
    weather: String
    size: Int
    isSpringTide: Boolean
    isMiddleTide: Boolean
    isNeapTide: Boolean
    isNagashio: Boolean
    isWakashio: Boolean
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
    weather: String
    size: Int
    isSpringTide: Boolean
    isMiddleTide: Boolean
    isNeapTide: Boolean
    isNagashio: Boolean
    isWakashio: Boolean
  }

  type InputPlace{
    id: ID!
    name:String
    prefectureId:Int
  }

  type InputFishLog{
    id: ID!
    placeId:Int,
    date: String,
    image: String,
    fishName: String,
    weather: String,
    size: Int,
    isSpringTide: Boolean,
    isMiddleTide: Boolean,
    isNeapTide: Boolean,
    isNagashio: Boolean,
    isWakashio: Boolean
  }

  type Query {
    getPlace(id:Int!): Place
    getAllPlaces:[Place]
    prefectures: [Prefecture]
    getFishLog(id:Int!): [FishLog]
    fishLogs(placeId: Int): [FishLog] 
  }

  type Mutation {
    createPlace(create:CreatePlace):InputPlace,
    createFishLog(create:CreateFishLog):InputFishLog
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
    fishLogs: async (_, {placeId }) => {
      const fishLogs = await prisma.fishLog.findMany({
        where: {
          placeId: placeId,
        },
        include: {
          place: {
            select: {
              name: true,
            },
          },
        },
      })

      //取得したデータをGraphQLレスポンスで返す前に変換する
      return fishLogs.map((fishLog) => {
        return {
          id: fishLog.id,
          placeId: fishLog.placeId,
          placeName: fishLog.place.name,
          date: fishLog.date,
          fishName: fishLog.fishName,
        }
      })
    },
    getFishLog: async (_, {id }) => {
      const fishLogs = await prisma.fishLog.findMany({
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
    
      return fishLogs.map(fishLog => ({
        id: fishLog.id,
        placeName:fishLog.place.name,
        date: fishLog.date,
        image: fishLog.image,
        fishName: fishLog.fishName,
        weather: fishLog.weather,
        size: fishLog.size,
        isSpringTide: fishLog.isSpringTide,
        isMiddleTide: fishLog.isMiddleTide,
        isNeapTide: fishLog.isNeapTide,
        isNagashio: fishLog.isNagashio,
        isWakashio: fishLog.isWakashio,
      }));
    },},

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
          weather,
          size,
          isSpringTide,
          isMiddleTide,
          isNeapTide,
          isNagashio,
          isWakashio,
        },
      },
    ) => {
      return await createFishLog(
        placeId,
        date,
        image,
        fishName,
        weather,
        size,
        isSpringTide,
        isMiddleTide,
        isNeapTide,
        isNagashio,
        isWakashio,
      )
    },
  },
}

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
