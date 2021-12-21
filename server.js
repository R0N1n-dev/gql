const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const cors = require("cors");
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
} = require("graphql");
const app = express();
const devs = [
    { id: 1, name: "Namco-Bandai" },
    { id: 2, name: "Illfonic" },
    { id: 3, name: "Shift-eve" },
    { id: 4, name: "Linceworks" },
    { id: 5, name: "Ember Labs" },
    { id: 6, name: "Guerilla" },
    { id: 7, name: "Capcom" },
    { id: 8, name: "Tango GameWorks" },
    { id: 9, name: "Santa Monica" },
    { id: 10, name: "Kojima" },
];

const games = [
    { id: 1, name: "Tekken 7", devId: 1 },
    { id: 2, name: "Arcadegeddon", devId: 2 },
    { id: 3, name: "Project Eve", devId: 3 },
    { id: 4, name: "Aragami 2", devId: 4 },
    { id: 5, name: "Kena: Bridge of Spirits", devId: 5 },
    { id: 6, name: "Horizon: Forbidden West", devId: 6 },
    { id: 7, name: "Pragmata", devId: 7 },
    { id: 8, name: "Ghostwire Tokyo", devId: 8 },
    { id: 9, name: "God of War: Ragnarok", devId: 9 },
    { id: 10, name: "Death Stranding", devId: 10 },
    { id: 11, name: "God of War", devId: 9 },
    { id: 12, name: "Tales of Arise", devId: 1 },
    { id: 13, name: "Dragonball FightersZ", devId: 1 },
    { id: 14, name: "Street Fighter V", devId: 7 },
    { id: 15, name: "The Evil Within", devId: 8 },
    { id: 16, name: "Resident Evil: Village", devId: 7 },
    { id: 17, name: "Killzone", devId: 6 },
    { id: 18, name: "Marvel Vs Capcom", devId: 7 },
    { id: 19, name: "One Piece Pirate Warriors", devId: 1 },
];

const GameType = new GraphQLObjectType({
    name: "Game",
    description: "Game developed by developer",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        devId: { type: GraphQLNonNull(GraphQLInt) },
        dev: {
            type: DevType,
            resolve: (game) => {
                return devs.find((dev) => dev.id === game.devId);
            },
        },
    }),
});

const DevType = new GraphQLObjectType({
    name: "Dev",
    description: "Developer developing the game",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        games: {
            type: new GraphQLList(GameType),
            resolve: (dev) => {
                return games.filter((game) => game.devId === dev.id);
            },
        },
    }),
});

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        games: {
            type: new GraphQLList(GameType),
            description: "list of games",
            resolve: () => games,
        },
        devs: {
            type: new GraphQLList(DevType),
            description: "list of devs",
            resolve: () => devs,
        },
        game: {
            type: GameType,
            description: " A single game",
            args: {
                id: {
                    type: GraphQLInt,
                },
            },
            resolve: (parent, args) => games.find((game) => game.id === args.id),
        },
        dev: {
            type: DevType,
            description: " A single developer",
            args: {
                id: {
                    type: GraphQLInt,
                },
            },
            resolve: (parent, args) => devs.find((dev) => dev.id === args.id),
        },
    }),
});

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        addGame: {
            type: GameType,
            description: "Add a game",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                devId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const game = {
                    id: games.length + 1,
                    name: args.name,
                    devId: args.devId,
                };
                games.push(game);
                return game;
            },
        },
        addDev: {
            type: DevType,
            description: "Add a developer",
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const dev = {
                    id: devs.length + 1,
                    name: args.name,
                };
                devs.push(dev);
                return dev;
            },
        },
    }),
});

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
});
app.use(cors({
    origin: '*'//'http://localhost:3000/'
}));

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        graphiql: true,
    })
);

app.listen(5000, () => console.log("Server running"));
