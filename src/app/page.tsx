import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Search, Bell, ChevronDown, Menu, TrendingUp, Users, MessageSquare, MousePointerClick, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] font-sans antialiased overflow-hidden text-gray-900">
      
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xl group-hover:scale-105 transition-transform">
              R
            </div>
            <span className="text-xl font-extrabold tracking-tight">ReviewFlow</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-[15px] font-semibold text-gray-700 hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-[15px] font-semibold text-gray-700 hover:text-blue-600 transition-colors">How it Works</Link>
            <Link href="/pricing" className="text-[15px] font-semibold text-gray-700 hover:text-blue-600 transition-colors">Pricing</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-[15px] font-semibold text-gray-700 hover:text-blue-600 transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="group flex items-center gap-2 rounded-full bg-[#1F242B] pl-6 pr-2 py-2 text-[14px] font-semibold text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg hover:-translate-y-0.5">
              <span>Get Started</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#1F242B] group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
            </Link>
          </div>
          
          <button className="md:hidden p-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative isolate pt-32 pb-16 w-full">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-center">
          <div className="h-[520px] w-[860px] rounded-full bg-gradient-to-r from-blue-600/10 via-blue-500/10 to-cyan-500/10 blur-3xl"></div>
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.05) 1px, transparent 1px)', backgroundSize: '64px 64px' }}></div>

        <div className="relative z-10 mx-auto max-w-[1240px] px-6 sm:px-10 text-center">
          
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-black/5 bg-white/90 px-4 py-1.5 shadow-sm backdrop-blur-md">
              <div className="flex -space-x-1.5">
                {[1,2,3].map((i) => (
                  <div key={i} className="h-5 w-5 rounded-full bg-gray-200 ring-2 ring-white overflow-hidden flex items-center justify-center">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                ))}
              </div>
              <span className="text-[12.5px] font-semibold text-gray-800">Generate 5-Star Reviews on Autopilot</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-[4.75rem] font-extrabold tracking-tight text-[#111111] leading-[1.1] max-w-4xl mx-auto">
            Turn Every Customer<br className="hidden sm:inline" /> Into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Loyal Advocate.</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 font-normal">
            Automatically request genuine Google reviews via WhatsApp after every purchase. Build a massive online reputation without lifting a finger.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="group flex w-full sm:w-auto items-center justify-center gap-3.5 rounded-full bg-[#1F242B] pl-6 pr-2.5 py-3 text-[15px] font-semibold text-white shadow-xl transition-all duration-300 hover:bg-blue-600 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.45)] hover:-translate-y-0.5">
              <span>Start 1 Month Free</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#232529] group-hover:text-blue-600 shadow-sm transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </div>
            </Link>
            <Link href="/demo" className="group flex items-center justify-center gap-2 px-4 py-3 text-[15px] font-semibold text-gray-800 hover:text-blue-600 transition-colors">
              <span>Book a Demo</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Dashboard Mockup Showcase */}
          <div className="relative mx-auto mt-16 max-w-[1080px]">
            {/* Glow behind mockup */}
            <div className="pointer-events-none absolute -inset-2 -z-10 rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 opacity-20 blur-2xl"></div>
            
            <div className="relative rounded-[2rem] border border-gray-200/90 bg-white shadow-2xl overflow-hidden text-left">
              
              {/* Mockup Topbar */}
              <div className="flex items-center justify-between border-b border-gray-100 bg-white px-7 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white font-bold text-xs">R</div>
                  <span className="text-sm font-bold text-gray-900">ReviewFlow</span>
                </div>
                <div className="hidden md:flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200/70 px-3 py-1.5 text-[11px] text-gray-500 w-48">
                  <Search className="h-3 w-3" /> <span>Search customers...</span>
                </div>
                <div className="flex items-center gap-4">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm"></div>
                </div>
              </div>

              {/* Mockup Body */}
              <div className="bg-[#FBFBFD] px-7 py-6 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Campaign Overview</h3>
                  <p className="text-[11px] text-gray-500">Live performance of your WhatsApp review requests.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1 */}
                  <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-medium text-gray-500">Total Customers</span>
                      <div className="h-8 w-8 rounded-xl bg-emerald-100 flex items-center justify-center"><Users className="h-4 w-4 text-emerald-600"/></div>
                    </div>
                    <div className="text-2xl font-extrabold text-gray-900">1,248</div>
                    <div className="text-[10px] font-bold text-emerald-600 mt-1">+12% this month</div>
                  </div>
                  {/* Card 2 */}
                  <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-medium text-gray-500">Requests Sent</span>
                      <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center"><MessageSquare className="h-4 w-4 text-blue-600"/></div>
                    </div>
                    <div className="text-2xl font-extrabold text-gray-900">1,102</div>
                    <div className="text-[10px] font-bold text-blue-600 mt-1">88% delivery rate</div>
                  </div>
                  {/* Card 3 */}
                  <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-medium text-gray-500">Review Clicks</span>
                      <div className="h-8 w-8 rounded-xl bg-purple-100 flex items-center justify-center"><MousePointerClick className="h-4 w-4 text-purple-600"/></div>
                    </div>
                    <div className="text-2xl font-extrabold text-gray-900">485</div>
                    <div className="text-[10px] font-bold text-emerald-600 mt-1">+24% conversion</div>
                  </div>
                  {/* Card 4 */}
                  <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-medium text-gray-500">Est. New Reviews</span>
                      <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center"><Star className="h-4 w-4 text-amber-600"/></div>
                    </div>
                    <div className="text-2xl font-extrabold text-gray-900">142</div>
                    <div className="text-[10px] font-bold text-emerald-600 mt-1">Based on industry avg</div>
                  </div>
                </div>

                {/* Chart Mockup area */}
                <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-gray-900 mb-4">Conversion Funnel</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-gray-500">Audience</span><span className="text-gray-900">1,248</span></div>
                      <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gray-300 w-full"></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-gray-500">WhatsApp Sent</span><span className="text-gray-900">1,102</span></div>
                      <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-400 w-[88%]"></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-medium"><span className="text-gray-500">Review Link Clicked</span><span className="text-gray-900">485</span></div>
                      <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 w-[38%] rounded-r-full"></div></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Partners / Integrations Marquee */}
      <section className="border-t border-gray-100 bg-white py-12 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">Seamlessly Integrates With</p>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-70 grayscale">
            {/* Google */}
            <div className="text-2xl font-bold flex items-center gap-2"><Star className="h-6 w-6"/> Google Business</div>
            {/* WhatsApp */}
            <div className="text-2xl font-bold flex items-center gap-2"><MessageSquare className="h-6 w-6"/> WhatsApp API</div>
            {/* Razorpay */}
            <div className="text-2xl font-bold flex items-center gap-2"><div className="h-6 w-6 bg-blue-600 rounded"></div> Razorpay</div>
            {/* Firebase */}
            <div className="text-2xl font-bold flex items-center gap-2"><Zap className="h-6 w-6"/> Firebase</div>
          </div>
        </div>
      </section>

    </div>
  );
}
