const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const gqlSchema = require('./graphql/schema/index');
const gqlResolvers = require('./graphql/resolvers/index')

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: gqlSchema,
    rootValue: gqlResolvers,
    graphiql: true
}));

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphql-hooks-db-ampjy.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
).then(
    app.listen(3000)
).catch(err => {
    console.log(err);
});