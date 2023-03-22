import * as dotenv from "dotenv";
dotenv.config();
import app from "./server";

const PORT = process.env.PORT || 5174;

app.listen(PORT, () => {
  console.log(`Now listening on http://localhost:${PORT}`);
});
