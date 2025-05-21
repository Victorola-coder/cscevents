"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import QRCode from "qrcode.react";

interface TicketData {
  name: string;
  email: string;
  department: string;
  quantity: number;
  paymentMethod: string;
  totalAmount: number;
  purchaseDate: string;
  ticketId: string;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("ticketPurchase");
      if (storedData) {
        setTicketData(JSON.parse(storedData));
      } else {
        // If no ticket data found, redirect to purchase page
        router.push("/tickets/purchase");
      }
    } catch (error) {
      console.error("Error retrieving ticket data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--malachite)]"></div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">No Ticket Data Found</h1>
        <p className="mb-6 text-gray-600">
          Your ticket information could not be found.
        </p>
        <Link href="/tickets/purchase">
          <Button className="bg-[var(--malachite)] hover:bg-[var(--goblin)] text-white">
            Return to Purchase Page
          </Button>
        </Link>
      </div>
    );
  }

  const ticketInfo = {
    id: ticketData.ticketId,
    name: ticketData.name,
    email: ticketData.email,
    department: ticketData.department,
    quantity: ticketData.quantity,
    event: "NACS Bits & Vibes Hangout",
    date: "June 14, 2024",
    venue: "Ojaja Resort",
    time: "12:00 PM",
  };

  const qrValue = JSON.stringify(ticketInfo);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById(
      "ticket-qr-code"
    ) as HTMLCanvasElement;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `NACS-Ticket-${ticketData.ticketId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[var(--goblin)] p-4 text-white">
            <h1 className="text-2xl font-bold">Ticket Confirmation</h1>
            <p className="text-sm opacity-90">NACS Bits & Vibes Hangout</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex flex-col">
                <div className="mb-6">
                  <span className="block text-sm text-gray-500">Ticket ID</span>
                  <span className="block font-bold text-lg">
                    {ticketData.ticketId}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Name:</span> {ticketData.name}
                  </div>
                  <div>
                    <span className="font-medium">Department:</span>{" "}
                    {ticketData.department}
                  </div>
                  <div>
                    <span className="font-medium">Quantity:</span>{" "}
                    {ticketData.quantity} ticket(s)
                  </div>
                  <div>
                    <span className="font-medium">Total Amount:</span> ₦
                    {ticketData.totalAmount.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Purchase Date:</span>{" "}
                    {formatDate(ticketData.purchaseDate)}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="font-medium text-lg mb-1">Event Details</div>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="font-medium">Date:</span> June 14, 2024
                    </div>
                    <div>
                      <span className="font-medium">Time:</span> 12:00 PM
                    </div>
                    <div>
                      <span className="font-medium">Venue:</span> Ojaja Resort
                    </div>
                  </div>
                </div>
              </div>

              <div className="border bg-white p-4 rounded-lg text-center">
                <QRCode
                  id="ticket-qr-code"
                  value={qrValue}
                  size={180}
                  renderAs="canvas"
                  includeMargin={true}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                  level="H"
                />
                <div className="mt-2 text-sm text-gray-500">
                  Scan to verify ticket
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col md:flex-row gap-4">
              <Button
                onClick={handleDownloadQR}
                className="bg-[var(--malachite)] hover:bg-[var(--goblin)] text-white"
              >
                Download QR Code
              </Button>
              <Link href="/tickets" className="flex-1 md:flex-none">
                <Button variant="outline" className="w-full md:w-auto">
                  Return to Event Page
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Please save this QR code or take a screenshot. You'll need it for
            entry.
          </p>
          <p className="mt-1">
            For any questions, please contact the event organizers.
          </p>
        </div>
      </div>
    </main>
  );
}
