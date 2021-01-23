const express = require( "express" );
const bodyParser = require( "body-parser" );
const cors = require( "cors" );

const app = express();

const swaggerUi = require( 'swagger-ui-express' );
const YAML = require( 'yamljs' );
const swaggerApiDocument = YAML.load( './app/documentation/api.yaml' );

var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
//var schema = buildSchema(`
//  type Query {
//    hello: String
//  }
//`);
var schema = require('./app/schemas/schema.js');
// The root provides a resolver function for each API endpoint
var root = {
    hello: () => {
        return 'Hello world!';
    },
};

app.use('/graphql', graphqlHTTP({
                                    schema: schema,
                                    rootValue: root,
                                    graphiql: true,
                                }));

app.use( '/api-docs', swaggerUi.serve, swaggerUi.setup( swaggerApiDocument ) );

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use( cors( corsOptions ) );

// parse requests of content-type - application/json
app.use( bodyParser.json() );

// parse requests of content-type - application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: true } ) );

const db = require( "./app/models" );
const Role = db.role;

//force: true - drop tables and re-sync database
//In production use sync without parameters
db.sequelize.sync( { force: true } ).then( () => {
    console.log( 'Drop and Resync Db' );
    initial();
} );

function initial() {
    Role.create( {
                     id:   1,
                     name: "user"
                 } );

    Role.create( {
                     id:   2,
                     name: "moderator"
                 } );

    Role.create( {
                     id:   3,
                     name: "admin"
                 } );
}

// simple route

app.get( "/", ( req, res ) => {
    res.json( { message: "Welcome to PetroCRM application." } );
} );

// routes
require( './app/routes/auth.routes' )( app );
require( './app/routes/user.routes' )( app );

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen( PORT, () => {
    console.log( `Server is running on port ${PORT}.` );
} );