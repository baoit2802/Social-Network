import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import expressListEndpoints from "express-list-endpoints";
import path from "path";
import { fileURLToPath } from "url";
import { createDefaultUser } from "./config/seedUser.js";

dotenv.config();
const app = express();

// Middleware 
app.use(cors());
app.use(express.json());

connectDB().then(() => {
    createDefaultUser();
});

// Xác định đường dẫn thư mục 
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static (client)
app.use(express.static(path.join(__dirname, "client")));

//  Route API
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(expressListEndpoints(app));
});