import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/app/components/ui/button";

export const metadata: Metadata = {
  title: "NACS Events",
  description: "Nigerian Association of Computing Students Events",
};

export default function EventsPage() {
  return (
    <main className="min-h-screen py-12 px-4 md:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--rangitoto)]">
          Upcoming Events
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured Event */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-64 bg-gradient-to-r from-[var(--malachite)] to-[var(--goblin)] relative">
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center">
                  BITS &amp; VIBES HANGOUT
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                <div>
                  <p className="text-gray-600 mb-1">
                    Nigerian Association of Computing Students
                  </p>
                  <p className="text-sm text-gray-500">
                    Obafemi Awolowo University, Ile-Ife
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Location:</span>
                      <span>Ojaja Resort</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Date:</span>
                      <span>Sat, June 14th, 2024</span>
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

                <div>
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
                </div>
              </div>

              <Link href="/tickets">
                <Button className="w-full md:w-auto bg-[var(--malachite)] hover:bg-[var(--goblin)] text-white">
                  Get Tickets
                </Button>
              </Link>
            </div>
          </div>

          {/* More events can be added here */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 flex items-center justify-center h-40">
            <p className="text-gray-400">More events coming soon...</p>
          </div>
        </div>

        {/* Admin link */}
        <div className="mt-12 pt-4 border-t border-gray-200 text-right">
          <Link href="/admin">
            <Button variant="outline" className="text-sm">
              Admin Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
