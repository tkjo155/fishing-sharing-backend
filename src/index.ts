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
  
  type Query {
    getPlace(id:Int!): Place
    prefectures: [Prefecture]
    fishLogs: [FishLog] 
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

  type Mutation {
    createPlace(create:CreatePlace):InputPlace,
    createFishLog(create:CreateFishLog):InputFishLog
  }

`

const resolvers = {
  Query: {
    prefectures: async () => {
      //dbからデータを取得し (Prisma を使用してデータベースと対話し)て、「都道府県」テーブルからデータをフェッチするのをまつ
      const prefecturesData = await prisma.prefecture.findMany()
      //そのデータを返す
      return prefecturesData
    },
    fishLogs: async () => {
      const fishLogsData = await prisma.fishLog.findMany({
        // Placeを含ませる
        include: {
          place: {
            select: {
              name: true,
            },
          },
        },
      })

      //取得したデータをGraphQLレスポンスで返す前に変換する
      return fishLogsData.map((fishLog) => {
        return {
          id: fishLog.id,
          placeName: fishLog.place.name,
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
      //指定されたplaceが見つかったか確認
      return (
        placeData && {
          //placeが見つかったらデータを返す
          id: placeData.id,
          name: placeData.name,
          prefecture: placeData.prefecture.name,
        }
      )
    },

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
