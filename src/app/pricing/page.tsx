import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] font-sans antialiased text-gray-900 pt-28">
      
      {/* Header (Same as landing page) */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xl group-hover:scale-105 transition-transform">R</div>
            <span className="text-xl font-extrabold tracking-tight">ReviewFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-[15px] font-semibold text-gray-700 hover:text-blue-600 transition-colors">Features</Link>
            <Link href="/pricing" className="text-[15px] font-semibold text-blue-600 transition-colors">Pricing</Link>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-[15px] font-semibold text-gray-700 hover:text-blue-600">Log in</Link>
            <Link href="/signup" className="group flex items-center gap-2 rounded-full bg-[#1F242B] pl-6 pr-2 py-2 text-[14px] font-semibold text-white shadow-md hover:bg-blue-600 transition-all hover:-translate-y-0.5">
              <span>Get Started</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#1F242B] group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative isolate pt-12 pb-20 w-full text-center">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.05) 1px, transparent 1px)', backgroundSize: '64px 64px' }}></div>
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">Simple, transparent pricing</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">No hidden fees, no contracts. Start for free and upgrade when your Google Business Profile explodes with new reviews.</p>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-5xl px-6 pb-24 grid md:grid-cols-2 gap-8 relative z-10">
        
        {/* Basic Tier */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
          <p className="text-sm text-gray-500 mb-6">Perfect for small local shops just getting started with automated reviews.</p>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-5xl font-extrabold text-gray-900">₹999</span>
            <span className="text-gray-500 font-medium">/ month</span>
          </div>
          <Link href="/signup">
            <Button className="w-full rounded-full py-6 text-base font-bold bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 mb-8" variant="outline">
              Start Free Trial
            </Button>
          </Link>
          <ul className="space-y-4">
            <li className="flex gap-3 text-gray-600 text-sm"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0"/> Up to 500 WhatsApp review requests/mo</li>
            <li className="flex gap-3 text-gray-600 text-sm"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0"/> Basic CSV Import</li>
            <li className="flex gap-3 text-gray-600 text-sm"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0"/> 1 Google Business Profile Location</li>
            <li className="flex gap-3 text-gray-600 text-sm"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0"/> Standard Dashboard Analytics</li>
          </ul>
        </div>

        {/* Pro Tier */}
        <div className="rounded-3xl border-2 border-blue-600 bg-white p-8 shadow-xl relative transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md flex items-center gap-1">
            <Zap className="h-3 w-3"/> Most Popular
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Growth</h3>
          <p className="text-sm text-gray-500 mb-6">For established businesses looking to dominate their local SEO.</p>
          <div className="flex items-baseline gap-2 mb-8">
            <span className="text-5xl font-extrabold text-gray-900">₹2499</span>
            <span className="text-gray-500 font-medium">/ month</span>
          </div>
          <Link href="/signup">
            <Button className="w-full rounded-full py-6 text-base font-bold bg-[#1F242B] text-white hover:bg-blue-600 transition-colors shadow-md mb-8">
              Get Started Now
            </Button>
          </Link>
          <ul className="space-y-4">
            <li className="flex gap-3 text-gray-600 text-sm"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0"/> <strong>Unlimited</strong> WhatsApp review requests</li>
            <li className="flex gap-3 text-gray-600 text-sm"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0"/> Advanced CSV & API Imports</li>
            <li className="flex gap-3 text-gray-600 text-sm"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0"/> Up to 5 Google Business Locations</li>
            <li className="flex gap-3 text-gray-600 text-sm"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0"/> Advanced Funnel Analytics</li>
            <li className="flex gap-3 text-gray-600 text-sm"><CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0"/> Priority Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
