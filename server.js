require("dotenv").config({ path: "./config.env" });
const app = require("./app");
const connectDatabase = require("./utils/dataBase");

connectDatabase();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
