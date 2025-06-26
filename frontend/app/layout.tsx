import "./globals.css";
import { ReactNode } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Movie Sentiment Analyzer",
  description: "Analyze movie reviews using AI and rule-based methods.",
};

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white text-gray-900">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <Toaster position="top-center" />{" "}
      </body>
    </html>
  );
}
