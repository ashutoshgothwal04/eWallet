import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const result = await sql`
         SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
         `;
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteTransactionById(req, res) {
  try {
    const { id } = req.params;
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }
    const result = await sql`
          DELETE FROM transactions WHERE id = ${id}
          RETURNING *
        `;
    if (result.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTransactionSummaryByUserId(req, res) {
      try {
        const { userId } = req.params;
        const balanceResult = await sql`
          SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
        `;
    
        const incomeResult = await sql`
          SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `;
        const expenseResult = await sql`
          SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_id = ${userId} AND amount < 0
        `;
        const summaryResult = {
          balance: balanceResult[0].balance,
          income: incomeResult[0].income,
          expense: expenseResult[0].expense,
        };
        res.status(200).json(summaryResult);
      } catch (error) {
        console.error("Error fetching transaction summary:", error);
        res.status(500).json({ error: "Internal server error" });
      }
}

export async function createTransaction(req, res) {
  const { user_id, title, amount, category } = req.body;
  if (!user_id || !title || amount === undefined || !category) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const result = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;
    res.status(200).json(result);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}