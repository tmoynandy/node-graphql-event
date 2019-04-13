const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');


//generating a schema as a string
const { buildSchema } = require('graphql');

const Event = require('./models/event');

const app = express();

//const events = [];

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
            return Event.find()
            .then(events =>{
                return  events.map(event =>{
                    return event
                })
            }).catch(err =>{
                throw err;
            })
        },
        createEvent : (args) =>{
            // const event = {
            //     _id : Math.random().toString(),
            //     title : args.eventInput.title,
            //     description : args.eventInput.description,
            //     price : +args.eventInput.price,
            //     date : args.eventInput.date
            // };
            // events.push(event);
            // return(event);
            const event = new Event ({
                title : args.eventInput.title,
                description : args.eventInput.description,
                price : +args.eventInput.price,
                date : new Date(args.eventInput.date)
            });
            return event
            event.save()
            .then( result =>{
                console.log('hahah')
                console.log(result);
                return result
            })
            .catch(err => {
                throw err;
            });
        }
    },
    graphiql : true
}));

mongoose.connect('mongodb://127.0.0.1:27017');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    app.listen(3000);
    console.log('hahahah connected');
});
