"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import Select from "@/app/components/ui/select";
import Link from "next/link";
import { generatePaymentReference } from "@/app/lib/mono";

export default function PurchasePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    quantity: 1,
    paymentMethod: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, parseInt(value) || 1) : value,
    }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.department.trim())
      newErrors.department = "Department is required";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Payment method is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // In a real app, this would redirect to Mono Connect or handle payment flow
      // For demo purposes, we'll simulate a payment process

      // Generate unique ticket ID and payment reference
      const ticketId = `NACS-${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`;
      const paymentReference = generatePaymentReference(ticketId);

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Store purchase details in localStorage for the confirmation page
      localStorage.setItem(
        "ticketPurchase",
        JSON.stringify({
          ...formData,
          totalAmount: formData.quantity * 2000,
          purchaseDate: new Date().toISOString(),
          ticketId,
          paymentReference,
        })
      );

      router.push("/tickets/confirmation");
    } catch (error) {
      console.error("Payment failed:", error);
      // Handle payment failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[var(--goblin)] p-4 text-white">
          <h1 className="text-2xl font-bold">Purchase Tickets</h1>
          <p className="text-sm opacity-90">NACS Bits & Vibes Hangout</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="department" className="block mb-1 font-medium">
              Department
            </label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Your department at OAU"
              className={errors.department ? "border-red-500" : ""}
            />
            {errors.department && (
              <p className="mt-1 text-sm text-red-500">{errors.department}</p>
            )}
          </div>

          <div>
            <label htmlFor="quantity" className="block mb-1 font-medium">
              Number of Tickets
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Math.max(1, prev.quantity - 1),
                  }))
                }
                className="px-3 py-2 border rounded-l-md bg-gray-100"
              >
                -
              </button>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className="rounded-none text-center"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: prev.quantity + 1,
                  }))
                }
                className="px-3 py-2 border rounded-r-md bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block mb-1 font-medium">
              Payment Method
            </label>
            <Select
              value={formData.paymentMethod}
              onChange={handlePaymentMethodChange}
              className={errors.paymentMethod ? "border-red-500" : ""}
              placeholder="Select payment method"
              options={[
                { label: "PalmPay", value: "palmpay" },
                { label: "OPay", value: "opay" },
              ]}
            />
            {errors.paymentMethod && (
              <p className="mt-1 text-sm text-red-500">
                {errors.paymentMethod}
              </p>
            )}
          </div>

          <div className="bg-gray-100 p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <span>Price per ticket:</span>
              <span>₦2,000</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Quantity:</span>
              <span>{formData.quantity}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-[var(--tia_maria)]">
                ₦{(formData.quantity * 2000).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/tickets" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Back
              </Button>
            </Link>
            <Button
              type="submit"
              className="flex-1 bg-[var(--malachite)] hover:bg-[var(--goblin)] text-white"
              disabled={loading}
            >
              {loading ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
