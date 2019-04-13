const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');

//generating a schema as a string
const { buildSchema } = require('graphql');

const app = express();

const events = [];

app.use(bodyParser.json());

// app.get('/', (req, res, next) =>{
//     res.send("Kaaj korche");
// })

//in graphql, we have only one endpoint where requests are made
app.use('/graphql', graphqlHttp({
    //schema should point at a valid graphql schema
    schema : buildSchema(`
        type Event {
            _id : ID!
            title : String!
            description : String!
            price : Float!
            date : String!
        }

        input EventInput {
            title : String!
            description : String! 
            price : Float 
            date : String
        }

        type RootQuery{
            events : [Event!]!
        }

        type RootMutation{
            createEvent (eventInput : EventInput!): Event
        }
        schema {
            query : RootQuery, 
            mutation : RootMutation
        }
    `),
    //for resolver-has a bundle of all resolvers
    rootValue : {
        //when the incoming request requests this event property, this function gets executed
        events : () =>{
            return events;
        },
        createEvent : (args) =>{
            const event = {
                _id : Math.random().toString(),
                title : args.eventInput.title,
                description : args.eventInput.description,
                price : +args.eventInput.price,
                date : args.eventInput.date
            };
            events.push(event);
            return(event);
        }
    },
    graphiql : true
}));


app.listen(3000);