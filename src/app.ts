import cookieParser from "cookie-parser";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { authRoute } from "./modules/auth/auth.route";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to DevPulse API");
});

app.use("/api/auth", authRoute);

app.use(globalErrorHandler);

export default app;
