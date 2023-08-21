import { randomUUID as uuid } from 'node:crypto'

import { GraphQLError } from 'graphql'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import axios from 'axios'

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
  enum HasPhone {
    YES
    NO
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    id: ID!
    name: String!
    phone: String
    address: Address!
    check: Boolean
  }

  type Query {
    personCount: Int!
    allPersons(phone: HasPhone): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      street: String!
      city: String!
      phone: String
    ): Person
    editNumber(
      name: String!
      phone: String!
    ): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: async (root, args) => {
      const { data: personsFromApi } = await axios.get('http://localhost:3000/persons')
      if (!args.phone) return personsFromApi

      const byPhone = (person) => args.phone === "YES"
        ? person.phone : !person.phone

      return personsFromApi.filter(byPhone)
    },
    findPerson: (root, args) => persons.find((p) => p.name === args.name)
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new GraphQLError('Person already exists', {
          extensions: {
            code: 'PERSON_ALREADY_EXISTS'
          }
        })
      }

      const person = { id: uuid(), ...args }
      persons.push(person)
      return person
    },
    editNumber: (root, args) => {
      const personIndex = persons.findIndex((p) => p.name === args.name)
      if (personIndex === -1) return null
      
      const person = persons[personIndex]
      const updatedPerson = { ...person, phone: args.phone }
      persons[personIndex] = updatedPerson

      return updatedPerson
    }
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    },
    check: () => true
  }
}

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers,
})

const { url } = await startStandaloneServer(server)
console.log(`🚀 Server ready at ${url}`)
