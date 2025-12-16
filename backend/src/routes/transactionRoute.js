import express from "express";
import {
  createTransaction,
  deleteTransactionById,
  getTransactionsByUserId,
  getTransactionSummaryByUserId,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", createTransaction);

router.get("/:userId", getTransactionsByUserId);

router.delete("/:id", deleteTransactionById);

router.get("/summary/:userId", getTransactionSummaryByUserId);

export default router;
