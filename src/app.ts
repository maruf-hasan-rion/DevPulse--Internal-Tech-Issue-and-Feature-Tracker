import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoute } from "./modules/Issue/issue.route";

const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to DevPulse API");
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);

app.use(globalErrorHandler);

export default app;
