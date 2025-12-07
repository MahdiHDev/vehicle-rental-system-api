import { Router } from "express";
import { auth } from "../../middleware/auth";
import { vehiclesContoller } from "./vehicles.controller";

const router = Router();

router.post("/", auth("admin"), vehiclesContoller.createVehicles);
router.get("/", auth("admin"), vehiclesContoller.getVehicles);
router.get("/:vehicleId", auth("admin"), vehiclesContoller.getSingleVehicles);
router.put("/:vehicleId", auth("admin"), vehiclesContoller.updateVechicles);
router.delete("/:vehicleId", auth("admin"), vehiclesContoller.deleteVehicles);

export const vehicleRoutes = router;
