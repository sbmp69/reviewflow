import Link from "next/link";
import { ArrowRight, Star, Heart, MapPin, Search } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] font-sans antialiased text-gray-900 pt-28">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xl group-hover:scale-105 transition-transform">R</div>
            <span className="text-xl font-extrabold tracking-tight">ReviewFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-[15px] font-semibold text-gray-700 hover:text-blue-600 transition-colors">Features</Link>
            <Link href="/pricing" className="text-[15px] font-semibold text-gray-700 hover:text-blue-600 transition-colors">Pricing</Link>
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
      <div className="relative isolate pt-12 pb-20 w-full text-center px-6">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6">
          <Heart className="h-3 w-3 fill-blue-600"/> Our Story
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-3xl mx-auto">Built for the local businesses that run our cities.</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">We noticed a massive problem: amazing local businesses were losing to mediocre competitors simply because the competitors had more Google Reviews.</p>
      </div>

      {/* Story Content */}
      <div className="mx-auto max-w-3xl px-6 pb-24 relative z-10 space-y-12 text-lg text-gray-600 leading-relaxed">
        
        <p>
          Local SEO is entirely dominated by one metric: <strong>Google Reviews</strong>. When a customer searches for "plumber near me" or "best cafe near me", Google simply ranks the businesses with the highest quantity of 5-star reviews at the top.
        </p>

        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-amber-100 p-3 rounded-2xl"><Star className="h-6 w-6 text-amber-600 fill-amber-600"/></div>
            <h3 className="text-2xl font-bold text-gray-900">The Review Gap</h3>
          </div>
          <p className="text-gray-500 text-base">
            The problem is that happy customers rarely leave reviews unprompted. They pay, they leave, they go on with their day. Meanwhile, the ONE angry customer will always go out of their way to leave a 1-star review. This creates an unfair "Review Gap".
          </p>
        </div>

        <p>
          We built <strong>ReviewFlow</strong> to close that gap. By automatically sending a polite, personalized WhatsApp message to every single customer a few hours after their visit, we capture the silent majority of happy customers.
        </p>
        
        <p>
          It's not magic, it's just consistency. When you automatically ask 100 happy customers for a review every week, you inevitably build an insurmountable wall of 5-star reviews, rocketing your business to the top of Google Maps.
        </p>

        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl text-center">
          <h3 className="text-2xl font-bold mb-4">Join our mission</h3>
          <p className="text-blue-100 mb-8 text-base">We are helping thousands of local businesses take back their local search rankings.</p>
          <Link href="/signup" className="inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-blue-600 shadow hover:scale-105 transition-transform">
            Start Your Free Trial
          </Link>
        </div>

      </div>

    </div>
  );
}
