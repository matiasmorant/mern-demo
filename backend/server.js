var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
const MongoClient = require('mongodb').MongoClient
const path = require('path');

MongoClient.connect('mongodb://db-user1:db-user1@ds245971.mlab.com:45971/people-demo')
	.then(
		(client) => {
			const People = client.db("people-demo").collection("people")

	    const schema = buildSchema(`
	      type Query {
	        people(name: String = "", origin: String): [Person]
	      }

	      type Person {
	        _id: String
	        first_name: String
	        last_name: String
	        email: String
	        gender: String
	        photo: String
	        origin: String
	      }

	      schema {
	        query: Query
	      }
	    `);

	    const resolvers = {
	        people: ({name, origin}) => {
        		re = name
        			.trim()
        			.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') // escape RegExp special characters
        			.replace(/\s+/, "|") // Interpret whitespace as an OR
        		re = RegExp(re,"i")
      			name_filter = re ? {$or: [{first_name: re}, {last_name: re}] } : {}
	        	origin_filter = origin ? {origin: origin} : {}
	        	console.log(name_filter,origin_filter)
	          return People.find(Object.assign(name_filter, origin_filter)).limit(10).toArray()
	        },
	    }
			// __________ create the server _______
      var app = express();
      // use graphql
      app.use('/graphql', graphqlHTTP({
        schema: schema,
        rootValue: resolvers,
      }));
      // serve frontend
      app.use(express.static(path.join(__dirname, 'build')));
      app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
      });

      app.listen(process.env.PORT || 4000, function(){
        console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
      });
		}
	)
