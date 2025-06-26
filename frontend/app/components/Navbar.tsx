"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Button from "./ui/Button";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full py-4 px-6 bg-gray-900 backdrop-blur-md shadow-md">
      <div className=" mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-white">
          🎥 Sentiment Analyzer
        </Link>

        <Button
          onClick={() => setOpen(!open)}
          className="sm:hidden text-white"
          aria-label="Toggle navigation"
          variant="ghost"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </Button>

        <div className="hidden sm:flex space-x-4">
          <Link
            href="/analysis"
            className="text-white hover:text-gray-300 font-medium"
          >
            Analyze
          </Link>
          <Link
            href="/all"
            className="text-white hover:text-gray-300 font-medium"
          >
            All Results
          </Link>
        </div>
      </div>

      {open && (
        <div className="sm:hidden mt-3 space-y-2 text-center">
          <Link
            href="/analysis"
            onClick={() => setOpen(false)}
            className="block text-white hover:text-blue-300 font-medium"
          >
            Analyze
          </Link>
          <Link
            href="/all"
            onClick={() => setOpen(false)}
            className="block text-white hover:text-blue-300 font-medium"
          >
            All Results
          </Link>
        </div>
      )}
    </nav>
  );
}
