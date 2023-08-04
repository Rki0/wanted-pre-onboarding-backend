const express = require("express");
const cors = require("cors");

const sequelize = require("./utils/database");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log("server connected.");
    });
  })
  .catch((err) => console.log("sequelize connect error.", err));
