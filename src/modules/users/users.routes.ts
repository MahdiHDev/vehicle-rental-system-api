import { Router } from "express";
import { adminOrSelf } from "../../middleware/adminOrSelf";
import { auth } from "../../middleware/auth";
import { userController } from "./users.controller";

const router = Router();

router.get("/", auth("admin"), userController.getAllUSer);
router.put(
    "/:userId",
    auth("admin", "customer"),
    adminOrSelf(),
    userController.updateUser
);
router.delete("/:userId", auth("admin"), userController.deleteUser);

export const userRoutes = router;
