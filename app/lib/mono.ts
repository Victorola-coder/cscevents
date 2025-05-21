import axios from "axios";
import { prisma } from "./prisma";

// These would come from environment variables in a real application
const MONO_SECRET_KEY = process.env.MONO_SECRET_KEY || "your_mono_secret_key";
const MONO_API_URL = process.env.MONO_API_URL || "https://api.withmono.com";

interface MonoTransaction {
  _id: string;
  amount: number;
  narration: string;
  date: string;
  type: "credit" | "debit";
  reference: string;
  balance: number;
}

interface MonoTransactionsResponse {
  data: {
    transactions: MonoTransaction[];
  };
}

/**
 * Verify if a payment has been made and update the database
 */
export async function verifyPayment(
  ticketId: string,
  reference: string,
  amount: number
): Promise<boolean> {
  try {
    // In development mode, simulate successful payment
    if (process.env.NODE_ENV === "development") {
      console.log("Development environment, simulating payment verification");

      // Update the database with simulated successful payment
      const ticket = await prisma.ticket.update({
        where: { ticketId },
        data: { paymentStatus: "completed" },
      });

      // Create a transaction record
      await prisma.transaction.create({
        data: {
          amount,
          narration: `NACS Bits & Vibes Payment - ${ticketId}`,
          reference,
          type: "credit",
          status: "completed",
          ticketId: ticket.id,
        },
      });

      return true;
    }

    // In production, make an actual API call to Mono
    const response = await axios.get<MonoTransactionsResponse>(
      `${MONO_API_URL}/v2/accounts/${ticketId}/transactions`,
      {
        headers: {
          accept: "application/json",
          "mono-sec-key": MONO_SECRET_KEY,
        },
      }
    );

    // Find transaction with matching reference and amount
    const matchingTransaction = response.data.data.transactions.find(
      (trans) =>
        trans.reference === reference &&
        trans.amount === amount &&
        trans.type === "credit"
    );

    if (matchingTransaction) {
      // Update the database with verified payment
      const ticket = await prisma.ticket.update({
        where: { ticketId },
        data: { paymentStatus: "completed" },
      });

      // Create a transaction record
      await prisma.transaction.create({
        data: {
          amount,
          narration: matchingTransaction.narration,
          reference,
          monoId: matchingTransaction._id,
          type: "credit",
          status: "completed",
          ticketId: ticket.id,
        },
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error verifying payment with Mono:", error);
    throw new Error("Payment verification failed");
  }
}

/**
 * Generate a payment reference
 */
export function generatePaymentReference(ticketId: string): string {
  return `NACS-${ticketId}-${Date.now()}`;
}

/**
 * Get recent transactions for a specific ticket from our database
 */
export async function getTransactionByTicketId(ticketId: string) {
  try {
    return await prisma.transaction.findUnique({
      where: { ticketId },
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    throw new Error("Failed to fetch transaction");
  }
}

/**
 * Get all recent transactions from our database
 */
export async function getAllTransactions(limit: number = 10) {
  try {
    return await prisma.transaction.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        ticket: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw new Error("Failed to fetch transactions");
  }
}
