import Link from "next/link";
import { CheckCircle2, MessageSquare, Star, Users, Zap, TrendingUp, Search } from "lucide-react";
import { MarketingHeader } from "@/components/MarketingHeader";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFC] font-sans antialiased text-gray-900 pt-28">
      <MarketingHeader />

      {/* Hero */}
      <div className="relative isolate pt-12 pb-20 w-full text-center">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(37,99,235,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.05) 1px, transparent 1px)', backgroundSize: '64px 64px' }}></div>
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">Everything you need to automate your reputation.</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">ReviewFlow is the all-in-one growth engine for local businesses. See how our features work together to bring you more 5-star reviews.</p>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-6xl px-6 pb-24 grid md:grid-cols-2 gap-8 relative z-10">
        
        {/* Feature Box 1 */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col group hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
            <MessageSquare className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">WhatsApp Automation</h3>
          <p className="text-gray-500 leading-relaxed mb-6 flex-1">Emails get ignored. SMS is too expensive. WhatsApp boasts a 98% open rate in India and other markets. We use the official Meta Graph API to securely send personalized review requests right to your customer's most used app.</p>
          <ul className="space-y-2 mt-auto">
            <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-emerald-500"/> Official WhatsApp Business API</li>
            <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-emerald-500"/> 98% average open rate</li>
          </ul>
        </div>

        {/* Feature Box 2 */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col group hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
            <TrendingUp className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Delay Engine</h3>
          <p className="text-gray-500 leading-relaxed mb-6 flex-1">Asking for a review the second a customer leaves is annoying. Waiting a week means they've forgotten. Our smart Inngest-powered queuing engine waits exactly the right amount of time before sending.</p>
          <ul className="space-y-2 mt-auto">
            <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-emerald-500"/> Configurable delay (e.g. 2 hours, 1 day)</li>
            <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-emerald-500"/> Reliable background job processing</li>
          </ul>
        </div>

        {/* Feature Box 3 */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col group hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
            <Users className="h-6 w-6 text-emerald-600 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Bulk CSV Importer</h3>
          <p className="text-gray-500 leading-relaxed mb-6 flex-1">Don't have an API? No problem. Export your daily sales from any POS (Square, Shopify, custom software) and drag-and-drop the CSV right into our dashboard. We map the columns automatically.</p>
          <ul className="space-y-2 mt-auto">
            <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-emerald-500"/> Instant drag-and-drop uploads</li>
            <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-emerald-500"/> Auto-duplicate prevention</li>
          </ul>
        </div>

        {/* Feature Box 4 */}
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm flex flex-col group hover:shadow-md transition-shadow">
          <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
            <Star className="h-6 w-6 text-amber-600 group-hover:text-white transition-colors" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Google Business Sync</h3>
          <p className="text-gray-500 leading-relaxed mb-6 flex-1">Connect your Google Business Profile with a single click. We auto-generate the exact short-link needed to send customers directly to your 5-star review modal, bypassing Google search entirely.</p>
          <ul className="space-y-2 mt-auto">
            <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-emerald-500"/> Frictionless 1-click review links</li>
            <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle2 className="h-4 w-4 text-emerald-500"/> Smart redirection tracking</li>
          </ul>
        </div>

      </div>

      {/* CTA */}
      <section className="bg-blue-600 py-16 text-center text-white px-6">
        <h2 className="text-3xl font-extrabold mb-4">Start generating reviews today.</h2>
        <p className="text-blue-100 mb-8 max-w-xl mx-auto">Setup takes less than 5 minutes. See how fast your local SEO rankings improve with constant, fresh 5-star reviews.</p>
        <Link href="/signup" className="inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-blue-600 shadow hover:scale-105 transition-transform">
          Create Free Account
        </Link>
      </section>
    </div>
  );
}
