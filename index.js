import { randomUUID as uuid } from 'node:crypto'

import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

const persons = [
  {
    id: uuid(),
    name: 'Cesar Villalobos Olmos',
    street: 'Avenida FullStack',
    city: 'Villa Hidalgo',
    phone: '999999999'
  },
  {
    id: uuid(),
    name: 'Miguel Angel',
    street: 'Calle FrontEnd',
    city: 'Barcelona',
    phone: '888888888'
  },
  {
    id: uuid(),
    name: 'Hector de Leon',
    street: 'Privada BackEnd',
    city: 'México City'
  }
]

const typeDefinitions = `#graphql
  type Person {
    id: ID!
    name: String!
    street: String!
    city: String!
    phone: String
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons
  }
}

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers,
})

const { url } = await startStandaloneServer(server)
console.log(`🚀 Server ready at ${url}`)
