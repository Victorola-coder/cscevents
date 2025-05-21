"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/button";
import BarcodeScannerModal from "@/app/components/home/qrocdeScan";

interface TicketInfo {
  id: string;
  name: string;
  email: string;
  department: string;
  quantity: number;
  event: string;
  date: string;
  venue: string;
  time: string;
}

interface ValidatedTicket {
  ticketInfo: TicketInfo;
  validatedAt: string;
  status: "valid" | "invalid" | "already-used";
}

export default function AdminPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedTicket, setScannedTicket] = useState<TicketInfo | null>(null);
  const [validationStatus, setValidationStatus] = useState<
    "valid" | "invalid" | "already-used" | null
  >(null);
  const [validatedTickets, setValidatedTickets] = useState<ValidatedTicket[]>(
    []
  );
  const [manualTicketId, setManualTicketId] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Simulating a database of tickets
  const mockTickets: Record<string, TicketInfo> = {
    "NACS-ABC123": {
      id: "NACS-ABC123",
      name: "John Doe",
      email: "john@example.com",
      department: "Computer Science",
      quantity: 2,
      event: "NACS Bits & Vibes Hangout",
      date: "June 14, 2024",
      venue: "Ojaja Resort",
      time: "12:00 PM",
    },
  };

  const validateTicket = (ticketData: string) => {
    try {
      setError(null);

      let ticketInfo: TicketInfo;
      try {
        ticketInfo = JSON.parse(ticketData);
      } catch (e) {
        // If it's not JSON, check if it's just a ticket ID
        if (mockTickets[ticketData]) {
          ticketInfo = mockTickets[ticketData];
        } else {
          throw new Error("Invalid QR code format");
        }
      }

      setScannedTicket(ticketInfo);

      // Check if ticket already used
      const alreadyUsed = validatedTickets.find(
        (ticket) => ticket.ticketInfo.id === ticketInfo.id
      );

      if (alreadyUsed) {
        setValidationStatus("already-used");
        return;
      }

      // In a real app, validate against backend
      const isValid = true; // For demo purposes

      if (isValid) {
        setValidationStatus("valid");
        setValidatedTickets((prev) => [
          ...prev,
          {
            ticketInfo,
            validatedAt: new Date().toISOString(),
            status: "valid",
          },
        ]);
      } else {
        setValidationStatus("invalid");
      }
    } catch (error) {
      console.error("Validation error:", error);
      setValidationStatus("invalid");
      setError(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const handleScanResult = (code: string) => {
    validateTicket(code);
  };

  const handleManualValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTicketId.trim()) return;

    validateTicket(manualTicketId);
    setManualTicketId("");
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-2 text-[var(--rangitoto)]">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mb-6">
            Scan and validate tickets for NACS Bits & Vibes Hangout
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <Button
              onClick={() => setShowScanner(true)}
              className="bg-[var(--malachite)] hover:bg-[var(--goblin)] text-white"
            >
              Scan QR Code
            </Button>

            <form
              onSubmit={handleManualValidation}
              className="flex-1 flex gap-2"
            >
              <input
                type="text"
                placeholder="Enter ticket ID manually"
                value={manualTicketId}
                onChange={(e) => setManualTicketId(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2"
              />
              <Button type="submit" variant="outline">
                Validate
              </Button>
            </form>
          </div>

          {scannedTicket && (
            <div
              className={`border rounded-md p-4 mb-8 ${
                validationStatus === "valid"
                  ? "bg-green-50 border-green-200"
                  : validationStatus === "already-used"
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-medium">Ticket Information</h2>
                <div
                  className={`px-3 py-1 rounded-full text-sm ${
                    validationStatus === "valid"
                      ? "bg-green-100 text-green-800"
                      : validationStatus === "already-used"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {validationStatus === "valid"
                    ? "Valid"
                    : validationStatus === "already-used"
                    ? "Already Used"
                    : "Invalid"}
                </div>
              </div>

              {error ? (
                <p className="text-red-600">{error}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Ticket ID</p>
                    <p className="font-medium">{scannedTicket.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{scannedTicket.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{scannedTicket.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium">
                      {scannedTicket.quantity} ticket(s)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Event</p>
                    <p className="font-medium">{scannedTicket.event}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">
                      {scannedTicket.date} at {scannedTicket.time}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <h2 className="text-lg font-medium mb-3">
              Recently Validated Tickets
            </h2>
            {validatedTickets.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Validated At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {validatedTickets.map((ticket, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3 text-sm">
                          {ticket.ticketInfo.id}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {ticket.ticketInfo.name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {ticket.ticketInfo.department}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {ticket.ticketInfo.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(ticket.validatedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">
                No tickets have been validated yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <BarcodeScannerModal
        show={showScanner}
        handleClose={() => setShowScanner(false)}
        title="Scan Ticket QR Code"
        onScan={handleScanResult}
      />
    </main>
  );
}
