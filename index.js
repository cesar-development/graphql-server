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
  },
  {
    id: uuid(),
    name: 'Fernando Herrera',
    street: 'Pasaje Testing',
    city: 'Ottawa'
  }
]

const typeDefinitions = `#graphql
  type Person {
    id: ID!
    name: String!
    street: String!
    city: String!
    phone: String
    address: String
    check: Boolean
  }

  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => persons.find((p) => p.name === args.name)
  },
  Person: {
    address: (root) => `${root.street}, ${root.city}`,
    check: () => true
  }
}

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers,
})

const { url } = await startStandaloneServer(server)
console.log(`🚀 Server ready at ${url}`)
