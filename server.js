const express = require("express");
const {graphqlHTTP} = require("express-graphql");

//Parse string to object
const {buildSchema} = require("graphql");

const app = express();

let data = {events: [], lastUpdated: ""};

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Graphql API
app.use(
	"/graphql",
	graphqlHTTP({
		schema: buildSchema(`
            type RootQuery {
                events : [String] 
                lastUpdated : String
            }
            type RootMutation {
                createEvent(name : String) : String  
            }
            schema {
                query : RootQuery 
                mutation : RootMutation
            }
        `),
		rootValue: {
			events: () => {
				return data.events;
			},
			lastUpdated: () => {
				return data.lastUpdated;
			},
			createEvent: (args) => {
				const eventName = args.name;
				data.events.push(eventName);
				data.lastUpdated =
					new Date().toDateString() + "  " + new Date().toTimeString();

				return `Updated List successfully with ${eventName}`;
			},
		},
		graphiql: true,
	}),
);

//Checking route
app.get("/", (req, res) => {
	res.send("Server is running Successfully ....");
});

//Port
const PORT = process.env.PORT || 5050;

//Server
app.listen(PORT, () => console.log(`Server is running in ${PORT} PORT`));
