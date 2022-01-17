import { app } from "./src/app";
import { connectDB } from "./src/controllers/services/microservices/db";
const port = process.env.PORT ?? 5000;

connectDB();
app.listen(port, () =>
  console.log(`server is running on http://localhost:5000`)
);
