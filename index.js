import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import { generateDescription } from "./controllers/description-genaration.controller.js";
import { getCrimeForecast } from "./controllers/crime-forcaste.controller.js";
import { fakedetection } from "./controllers/detect-fake.controller.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/description-genration", generateDescription);
app.use("/api/crime-forecast", getCrimeForecast);
app.use("/api/fake", fakedetection);
//health route
app.get("/api/health", (req, res) => {
  res.status(200).send("Server is running");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
