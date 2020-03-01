const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const productDB = [];
const resolvers = {
  Query: {
    ProductList,
  },
  Mutation: {
    productAdd,
  },
};

function ProductList() {
 return productDB;
}
function productAdd(_, { issue }) {
 issue.id = productDB.length + 1;
 productDB.push(issue);
 return issue;
}
const server = new ApolloServer({
  typeDefs : fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();
app.use(express.static('public'));
server.applyMiddleware({ app, path: '/graphql' });
app.listen(3000, function () {
  console.log('App started on port 3000');
});
