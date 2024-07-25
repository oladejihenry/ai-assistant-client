import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI-Driven virtual travel assistant",
  description: "A virtual travel assistant that uses AI to provide personalized travel itineraries, and suggest local attractions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
