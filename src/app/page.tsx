import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Search, Bell, ChevronDown, Menu, TrendingUp, Users, MessageSquare, MousePointerClick, Zap, CheckCircle2, BarChart3 } from "lucide-react";

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
            <div className="text-2xl font-bold flex items-center gap-2"><Star className="h-6 w-6"/> Google Business</div>
            <div className="text-2xl font-bold flex items-center gap-2"><MessageSquare className="h-6 w-6"/> WhatsApp API</div>
            <div className="text-2xl font-bold flex items-center gap-2"><div className="h-6 w-6 bg-blue-600 rounded"></div> Razorpay</div>
            <div className="text-2xl font-bold flex items-center gap-2"><Zap className="h-6 w-6"/> Firebase</div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section id="features" className="py-24 bg-[#FAFAFC] relative">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Why Choose ReviewFlow?</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Everything you need to turn casual visitors into powerful 5-star Google reviews.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col">
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 flex-1 flex items-center justify-center border border-gray-100 min-h-[200px]">
                {/* Mini UI Visual 1 */}
                <div className="bg-white p-4 rounded-xl shadow-sm w-full border border-gray-100 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-500 flex items-center gap-1"><TrendingUp className="h-3 w-3 text-blue-500"/> Conversion</span>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Healthy</span>
                  </div>
                  <div className="text-3xl font-extrabold text-gray-900 mb-4">44%</div>
                  <div className="h-10 w-full relative">
                    <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <path d="M0,25 Q20,25 40,15 T100,5" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
                      <path d="M0,25 Q20,25 40,15 T100,5 L100,30 L0,30 Z" fill="url(#blue-grad)" className="opacity-20"/>
                      <defs>
                        <linearGradient id="blue-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6"/><stop offset="100%" stopColor="transparent"/></linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-md">
                    +18% More Reviews
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Automated Review Requests</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Turn one-time visitors into vocal advocates with perfectly timed WhatsApp messages sent automatically after every purchase.</p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col">
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 flex-1 flex items-center justify-center border border-gray-100 min-h-[200px]">
                {/* Mini UI Visual 2 - Node Diagram */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Center Node */}
                  <div className="z-10 bg-white border shadow-md rounded-xl py-2 px-4 flex items-center gap-2 font-bold text-sm text-gray-900">
                    <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center text-white text-[10px]">R</div>
                    ReviewFlow
                  </div>
                  {/* Surrounding Nodes */}
                  <div className="absolute top-2 left-4 bg-white border shadow-sm rounded-full py-1 px-3 text-[10px] font-semibold text-gray-600 flex items-center gap-1"><Star className="h-3 w-3 text-amber-500"/> Google</div>
                  <div className="absolute top-2 right-4 bg-white border shadow-sm rounded-full py-1 px-3 text-[10px] font-semibold text-gray-600 flex items-center gap-1"><MessageSquare className="h-3 w-3 text-green-500"/> WhatsApp</div>
                  <div className="absolute bottom-2 left-6 bg-white border shadow-sm rounded-full py-1 px-3 text-[10px] font-semibold text-gray-600 flex items-center gap-1"><Users className="h-3 w-3 text-blue-500"/> POS Import</div>
                  <div className="absolute bottom-2 right-6 bg-white border shadow-sm rounded-full py-1 px-3 text-[10px] font-semibold text-gray-600 flex items-center gap-1"><BarChart3 className="h-3 w-3 text-purple-500"/> Analytics</div>
                  
                  {/* Dashed lines connecting them (simplified SVG) */}
                  <svg className="absolute inset-0 h-full w-full pointer-events-none" style={{ zIndex: 0 }}>
                    <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />
                    <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />
                    <line x1="50%" y1="50%" x2="30%" y2="75%" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />
                    <line x1="50%" y1="50%" x2="70%" y2="75%" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">All-in-One Funnel</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Everything works together. Upload your daily sales via CSV, and we handle the exact timing, messaging, and tracking of the review funnel.</p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col">
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 flex-1 flex items-center justify-center border border-gray-100 min-h-[200px]">
                {/* Mini UI Visual 3 - Flow */}
                <div className="w-full space-y-3">
                  <div className="bg-white border rounded-lg p-2.5 flex justify-between items-center shadow-sm relative z-10">
                    <div className="flex items-center gap-2"><div className="bg-gray-100 p-1 rounded"><Users className="h-3 w-3 text-gray-600"/></div><span className="text-xs font-bold text-gray-800">Customer Visit</span></div>
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full">Sale Completed</span>
                  </div>
                  <div className="flex justify-center -my-1"><div className="h-4 border-l-2 border-dashed border-gray-300"></div></div>
                  <div className="bg-white border rounded-lg p-2.5 flex justify-between items-center shadow-sm relative z-10">
                    <div className="flex items-center gap-2"><div className="bg-blue-50 p-1 rounded"><MessageSquare className="h-3 w-3 text-blue-600"/></div><span className="text-xs font-bold text-gray-800">WhatsApp Sent</span></div>
                    <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-full">Automated 2h later</span>
                  </div>
                  <div className="flex justify-center -my-1"><div className="h-4 border-l-2 border-dashed border-gray-300"></div></div>
                  <div className="bg-white border rounded-lg p-2.5 flex justify-between items-center shadow-sm ring-2 ring-blue-500/20 relative z-10">
                    <div className="flex items-center gap-2"><div className="bg-amber-50 p-1 rounded"><Star className="h-3 w-3 text-amber-500"/></div><span className="text-xs font-bold text-gray-800">Google Review</span></div>
                    <span className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">5 Stars Recorded</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Set it & Grow</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Automate follow-ups and review gathering so your local business keeps growing its online reputation while you focus on running the shop.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section (Zigzag) */}
      <section id="how-it-works" className="py-24 bg-white overflow-hidden">
        <div className="mx-auto max-w-[1240px] px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">How ReviewFlow Works</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Three simple steps to put your Google Business Profile on steroids.</p>
          </div>

          <div className="space-y-24">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-blue-100 text-blue-700 font-bold text-lg">1</div>
                <h3 className="text-3xl font-extrabold text-gray-900">Log Your Daily Sales</h3>
                <p className="text-lg text-gray-600 leading-relaxed">Simply upload your daily POS spreadsheet via CSV, or quickly add a customer manually in our beautiful dashboard. We instantly ingest names, phone numbers, and purchases.</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle2 className="h-5 w-5 text-emerald-500"/> Bulk upload up to 500 customers instantly</li>
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle2 className="h-5 w-5 text-emerald-500"/> Mobile-friendly manual entry</li>
                </ul>
              </div>
              <div className="flex-1 w-full">
                <div className="relative rounded-2xl bg-gray-50 border shadow-lg p-6">
                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-4 border-b pb-4">
                      <span className="font-bold text-gray-800">CSV Import Dashboard</span>
                      <Button size="sm">Upload Data</Button>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
                      <div className="h-8 bg-gray-50 rounded animate-pulse w-5/6"></div>
                      <div className="h-8 bg-gray-50 rounded animate-pulse w-4/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-blue-100 text-blue-700 font-bold text-lg">2</div>
                <h3 className="text-3xl font-extrabold text-gray-900">We Automate the Rest</h3>
                <p className="text-lg text-gray-600 leading-relaxed">Our Inngest-powered background engine waits for exactly the right moment (e.g., 2 hours after a visit) and dispatches a polite, customized WhatsApp template asking for feedback.</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle2 className="h-5 w-5 text-emerald-500"/> Official Meta WhatsApp API integration</li>
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle2 className="h-5 w-5 text-emerald-500"/> Perfect timing increases conversions by 40%</li>
                </ul>
              </div>
              <div className="flex-1 w-full relative">
                {/* Chat Bubble Mockup */}
                <div className="relative max-w-xs mx-auto">
                  <div className="bg-[#EFEFEF] rounded-[2rem] p-3 shadow-xl border-4 border-gray-900">
                    <div className="bg-white rounded-t-3xl rounded-b-xl px-4 py-3 mb-2 shadow-sm text-sm text-gray-800 border">
                      <p className="font-semibold mb-1">ReviewFlow Spa</p>
                      <p>Hi Sarah! Thanks for visiting us today. We hope you loved your session.</p>
                    </div>
                    <div className="bg-white rounded-xl px-4 py-3 shadow-sm text-sm text-gray-800 border">
                      <p>Would you mind taking 10 seconds to leave us a quick Google review? It helps us a lot! ❤️</p>
                      <div className="mt-3 text-blue-600 font-bold border-t pt-2 text-center text-xs">
                        Leave a Review
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-gray-500 mt-2 pr-2">Read 2:14 PM <CheckCircle2 className="inline h-3 w-3 text-blue-500"/></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/30 blur-[100px] rounded-full"></div>
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center z-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">Ready to dominate your local SEO?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Stop waiting for customers to review you. Join the businesses automatically generating 5-star reputations every single day.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto rounded-full bg-white px-8 py-4 text-base font-bold text-gray-900 shadow-lg hover:bg-gray-50 hover:scale-105 transition-all">
              Start 1 Month Free
            </Link>
            <Link href="/demo" className="w-full sm:w-auto rounded-full border border-gray-700 bg-gray-800/50 px-8 py-4 text-base font-bold text-white hover:bg-gray-800 transition-all">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 gap-4">
          <div className="flex items-center gap-2 font-bold text-gray-900 text-lg">
            <div className="h-6 w-6 bg-blue-600 text-white rounded flex items-center justify-center text-xs">R</div>
            ReviewFlow
          </div>
          <p>© {new Date().getFullYear()} ReviewFlow SaaS. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-blue-600">Privacy</Link>
            <Link href="#" className="hover:text-blue-600">Terms</Link>
            <Link href="#" className="hover:text-blue-600">Contact</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
