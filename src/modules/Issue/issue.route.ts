import { Router } from "express";
import { issueController } from "./issue.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);

router.post(
  "/",
  auth("contributor", "maintainer"),
  issueController.createIssueInDB,
);
router.patch(
  "/:id",
  auth("contributor", "maintainer"),
  issueController.updateIssue,
);
router.delete("/:id", auth("maintainer"), issueController.deleteIssue);

export const issueRoute = router;
