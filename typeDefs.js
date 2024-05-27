const { gql } = require('apollo-server');

const typeDefs = gql`
  scalar Upload

  type File {
    id: Int!
    filename: String!
    mimetype: String!
    encoding: String!
    path: String!
    createdAt: String!
  }

  type Query {
    files: [File!]!
  }

  type Mutation {
    uploadFile(file: Upload!): File!
    uploadFiles(files: [Upload!]!): [File!]!
  }
`;

module.exports = typeDefs;
