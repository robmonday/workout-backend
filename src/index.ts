import * as dotenv from "dotenv";
dotenv.config();
import app from "./server";

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Now listening on port: ${PORT}`);
});
