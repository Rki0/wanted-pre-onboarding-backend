const express = require("express");
const cors = require("cors");

const HttpError = require("./models/http-error");
const sequelize = require("./utils/database");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const User = require("./models/user");
const Post = require("./models/post");

const PORT = process.env.PORT || 80;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

app.use((req, res, next) => {
  const error = new HttpError("경로를 찾을 수 없습니다.", 404);
  throw error;
});

Post.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
  foreignKey: "userId",
});
User.hasMany(Post);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log("server connected.");
    });
  })
  .catch((err) => console.log("sequelize connect error.", err));
