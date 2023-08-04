const express = require("express");
const cors = require("cors");

const HttpError = require("./models/http-error");
const sequelize = require("./utils/database");
const userRoutes = require("./routes/user");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("경로를 찾을 수 없습니다.", 404);
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
