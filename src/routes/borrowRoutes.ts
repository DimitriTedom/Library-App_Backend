import { Router } from "express";
import { borrowBook, getUserBorrowHist, returnBook } from "../controllers/borrowController";

const router = Router();

router.post("/",borrowBook);
router.put("/:id/return",returnBook);
router.get("user/:userID",getUserBorrowHist);

export default router;