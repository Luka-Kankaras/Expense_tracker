import express from "express";
import {
    getUserRecords,
    createRecord,
    createType,
    createSubtype,
    getUserRecordTypes,
    subtypesOfType,
    removeType,
    removeSubtype
} from "../controllers/records.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Records
router.post("/create", verifyToken, createRecord);
router.get("/:userId", verifyToken, getUserRecords);

// Types
router.post("/types/create", verifyToken, createType);
router.delete("/types/remove", verifyToken, removeType);
router.get("/types/:userId", verifyToken, getUserRecordTypes);

// Subtypes
router.post("/subtypes/create", verifyToken, createSubtype);
router.delete("/subtypes/remove", verifyToken, removeSubtype);
router.get("/subtypes/:typeId", verifyToken, subtypesOfType);


export default router;