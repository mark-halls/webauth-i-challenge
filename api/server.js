const express = require(`express`);
const helmet = require(`helmet`);
const cors = require(`cors`);
const sessions = require(`express-session`);
const KnexSessionStore = require(`connect-session-knex`)(sessions);

const knex = require(`../data/db-config`);

const userRouter = require(`../data/users/users-router`);
const authRouter = require(`../auth/auth-router`);
const restricted = require(`../auth/restricted-middleware`);

const port = process.env.PORT || 4000;

const server = express();
const sessionConfiguration = {
  // session storage options
  name: "chocolatechip", // default would be sid
  secret: "keep it secret, keep it safe!", // used for encryption (must be an environment variable)
  saveUninitialized: true, // has implications with GDPR laws
  resave: false,
  store: new KnexSessionStore({
    knex,
    tablename: "sessions",
    createtable: true,
    sidfieldname: "sid",
    clearInterval: 1000 * 60 * 10
  }),
  // cookie options
  cookie: {
    maxAge: 1000 * 60 * 10, // 10 mins in milliseconds
    secure: false, // if false the cookie es sent over http, if true only sent over https
    httpOnly: true // if true JS cannot access the cookie
  }
};
server.use(helmet());
server.use(cors());
server.use(sessions(sessionConfiguration));
server.use(express.json());
server.use(`/api/auth`, authRouter);
server.use(`/api/restricted`, restricted);
server.use(`/api/restricted/users`, userRouter);

const start = () =>
  server.listen(port, () =>
    console.log(`\n **Server running on port ${port}**\n`)
  );

module.exports = { start };
