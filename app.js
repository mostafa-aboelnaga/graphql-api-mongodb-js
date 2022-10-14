const express = require("express");
const { default: mongoose } = require("mongoose");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const cors = require("cors")

const schema = require("./schema/schema");
const port = process.env.PORT || 4000;
const app = express();

app.use(cors())
app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema: schema,
  }),
);

mongoose
  .connect(
    `mongodb+srv://${process.env.mongoUsername}:${process.env.mongoPassword}@cluster0.zlbzwto.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`,
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((e) => console.log(e));
