const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


//generating a schema as a string
const { buildSchema } = require('graphql');

const Event = require('./models/event');
const User = require('./models/user');

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
            creator : User
        }

        type User {
            _id : ID!
            email : String!
            password : String
            createdEvents : [Event!]
        }

        input UserInput {
            email : String!,
            password : String!
        }

        input EventInput {
            title : String!
            description : String! 
            price : Float 
            date : String
        }

        type RootQuery{
            events : [Event!]!
            users : [User!]!
        }

        type RootMutation{
            createEvent (eventInput : EventInput!): Event
            createUser (userInput : UserInput!): User
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
            return Event.find().populate('creator')
            .then(events =>{
                return  events.map(event =>{
                    return {
                        event,
                        _id :event.id,
                    }
                })
            }).catch(err =>{
                throw err;
            })
        },
        users : () =>{
            return User.find()
            .then(users =>{
                return users.map(user =>{
                    return user
                })
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
                date : new Date(args.eventInput.date),
                creator : "5cb49ee2dfa42b2dd37ab6d0"
            });
            let createdEvent;
            return event
            .save()
            .then( result =>{
                createdEvent = result
                return User.findById("5cb49ee2dfa42b2dd37ab6d0")
                console.log('hahah')
                console.log(result);
                
            })
            .then( user =>{
                if(!user){
                    throw new Error('User not found')
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then( result =>{
                return createdEvent
            })
            .catch(err => {
                throw err;
            });
        },
        createUser : (args) =>{
            return User.findOne({
                email : args.userInput.email
            })
            .then( user =>{
                if(user){
                    throw new Error('User Exists Already')
                }
                return bcrypt
                .hash(args.userInput.password, 12)

            })
            .then( hashedPassword =>{
                const user = new User ({
                    email : args.userInput.email,
                    password : hashedPassword
                });
                return user.save();
            })
            .then(result => {
                return result
            })
            .catch( err =>{
                throw err;
            }) 
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
