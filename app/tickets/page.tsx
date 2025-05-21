import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export const metadata: Metadata = {
  title: "NACS Bits & Vibes Hangout",
  description: "Get your tickets for NACS Bits & Vibes Hangout",
};

export default function TicketsPage() {
  return (
    <main className="min-h-screen py-8 px-4 md:px-8">
      <section className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div
          className="h-64 bg-[var(--malachite)] relative flex items-center justify-center"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--malachite) 0%, var(--goblin) 100%)",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-white relative z-10">
            BITS &amp; VIBES
          </h1>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">NACS Hangout</h2>
              <p className="text-gray-600 mb-1">Class of '23 Presents</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Location:</span>
                  <span>Ojaja Resort</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Date:</span>
                  <span>Sat, June 14th</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Time:</span>
                  <span>12:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Price:</span>
                  <span className="text-[var(--tia_maria)] font-bold">
                    ₦2,000
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Featured Artists</h3>
              <ul className="space-y-1">
                <li>
                  <span className="font-medium">MC:</span> Ayo Santos
                </li>
                <li>
                  <span className="font-medium">Music Policy:</span> DJ
                  MAGiCKING
                </li>
                <li>
                  <span className="font-medium">Guest Artist:</span> Vybekid
                </li>
              </ul>

              <div className="mt-4 pt-3 border-t border-gray-300">
                <h4 className="font-medium mb-1">Features</h4>
                <p className="text-sm text-gray-600">
                  Giveaways, Games & Competitions, Chill Sessions, Food &
                  Drinks, Good Vibes & More
                </p>
              </div>
            </div>
          </div>

          <Link href="/tickets/purchase" className="w-full">
            <Button className="w-full bg-[var(--malachite)] hover:bg-[var(--goblin)] text-white py-3 text-lg">
              Get Tickets Now
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
