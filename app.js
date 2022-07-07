const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { MemoryStore } = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const sql = require("mysql");
// const client = redis.createClient();
const app = express();
const mysql = require("mysql2");
const MySQLStore = require("express-mysql-session")(session);
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "sudu_1000",
  database: "test",
});
const store = new session.MemoryStore();
const admin = require("./routes");
// const store = new RedisStore({
//   host: "localhost",
//   port: 6379,
//   client,
//   ttl: 260,
// });

const sessionClient = sql.createConnection({
  user: "root",
  host: "localhost",
  password: "sudu_1000",
  database: "test",
  port: 3306,
});

const sessionStore = new MySQLStore(
  {
    expiration: 60 * 60 * 24 * 7 * 1000,
    createDatabaseTable: true,
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  },
  sessionClient
);

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    key: "keyin",
    store: store,
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/admin", admin);

app.post("/login", (req, res) => {
  const { username } = req.body;
  req.session.username = username;
  res.send("Session main route");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.send("logout");
    }
  });
});

app.get("/", (req, res) => {
  console.log("/app");
  if (req.session.username) {
    res.send("username" + req.session.username);
  } else {
    res.send("no username");
  }
  console.log(req.session);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
