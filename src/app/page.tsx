import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
        ReviewFlow
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Get more genuine Google reviews, automatically. Turn every completed sale into a simple, timely request for an honest review.
      </p>
      
      <div className="flex gap-4">
        <Link href="/signup">
          <Button size="lg" className="text-lg px-8">Get Started</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline" size="lg" className="text-lg px-8">Log In</Button>
        </Link>
      </div>
    </div>
  );
}
