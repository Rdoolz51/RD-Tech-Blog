const express = require("express");

const routes = require("./controllers");

const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sess = {
    secret: "Super secretive secret stuff",
    cookie: {},
    resave: false,
    saveUnitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    }),
};

app.use(session(sess));

//uncomment when ready to initialize handlebars
// app.engine("handlebars", hbs.engine);
// app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () =>
        console.log(`Live at http://localhost:${PORT}`)
    );
});