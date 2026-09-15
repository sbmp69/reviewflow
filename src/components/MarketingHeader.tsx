import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

export function MarketingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 h-20">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="m9 18 6-6-6-6"/>
              <path d="m14 18 6-6-6-6" className="opacity-50"/>
            </svg>
          </div>
          <span className="text-[22px] font-bold tracking-tight text-gray-900 lowercase">reviewflow</span>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="group relative flex items-center gap-1 cursor-pointer text-[15px] font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            All Pages <ChevronDown className="h-4 w-4 opacity-50" />
            {/* Simple dropdown mock */}
            <div className="absolute top-full left-0 mt-4 w-48 rounded-xl border border-gray-100 bg-white p-2 opacity-0 shadow-lg group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
              <Link href="/" className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Home</Link>
              <Link href="/features" className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Features</Link>
              <Link href="/pricing" className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Pricing</Link>
              <Link href="/about" className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Company</Link>
            </div>
          </div>
          <Link href="/features" className="text-[15px] font-semibold text-gray-700 hover:text-blue-600 transition-colors">Features</Link>
          <Link href="/about" className="text-[15px] font-semibold text-gray-700 hover:text-blue-600 transition-colors">Company</Link>
          <Link href="/pricing" className="text-[15px] font-semibold text-gray-700 hover:text-blue-600 transition-colors">Pricing</Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className="text-[15px] font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="group flex items-center gap-3.5 rounded-full bg-[#1F242B] pl-6 pr-2 py-2 text-[14px] font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5">
            <span>Get Started</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#1F242B] group-hover:text-blue-600 shadow-sm transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>
          </Link>
        </div>
        
      </div>
    </header>
  );
}
