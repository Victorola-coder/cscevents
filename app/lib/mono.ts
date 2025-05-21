import axios from "axios";

// These would come from environment variables in a real application
const MONO_SECRET_KEY = "your_mono_secret_key";
const MONO_API_URL = "https://api.withmono.com";

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
 * Verify if a payment has been made
 * In a real application, you would search for specific transactions
 * with a reference or specific narration that matches the payment
 */
export async function verifyPayment(
  accountId: string,
  reference: string,
  amount: number
): Promise<boolean> {
  try {
    // In a real app, this would be implemented with proper authentication and parameters
    // For this example, we'll simulate a successful verification

    if (process.env.NODE_ENV === "development") {
      console.log("Development environment, simulating payment verification");
      // Simulate verification (always successful in development)
      return true;
    }

    // In production, you would make an actual API call
    const response = await axios.get<MonoTransactionsResponse>(
      `${MONO_API_URL}/v2/accounts/${accountId}/transactions`,
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

    return !!matchingTransaction;
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
 * Get recent transactions for an account
 */
export async function getRecentTransactions(
  accountId: string
): Promise<MonoTransaction[]> {
  try {
    if (process.env.NODE_ENV === "development") {
      // Return mock data in development
      return mockTransactions;
    }

    const response = await axios.get<MonoTransactionsResponse>(
      `${MONO_API_URL}/v2/accounts/${accountId}/transactions`,
      {
        headers: {
          accept: "application/json",
          "mono-sec-key": MONO_SECRET_KEY,
        },
      }
    );

    return response.data.data.transactions;
  } catch (error) {
    console.error("Error fetching transactions from Mono:", error);
    throw new Error("Failed to fetch transactions");
  }
}

// Mock transactions for development
const mockTransactions: MonoTransaction[] = [
  {
    _id: "12345",
    amount: 2000,
    narration: "NACS Bits & Vibes Payment",
    date: new Date().toISOString(),
    type: "credit",
    reference: "NACS-ABC123-1623456789",
    balance: 15000,
  },
  {
    _id: "12346",
    amount: 4000,
    narration: "NACS Bits & Vibes Payment (2 tickets)",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    type: "credit",
    reference: "NACS-DEF456-1623456790",
    balance: 13000,
  },
];
