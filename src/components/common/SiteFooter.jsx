import { Scale } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SiteFooter() {
  const socialClass = 'grid h-10 w-10 place-items-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-amber-300 hover:bg-slate-800 hover:text-amber-200 focus-visible:outline-amber-200'

  return <footer className="mt-20 bg-slate-950 text-slate-300">
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_0.8fr_1fr]">
      <div><div className="inline-flex items-center gap-2.5 text-white"><span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-200 text-slate-950"><Scale size={19} strokeWidth={1.8} /></span><span><span className="le-display block text-xl font-bold leading-none">LegalEase</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Legal counsel</span></span></div><p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">A considered way to discover legal expertise and make informed hiring decisions.</p><div className="mt-5 flex gap-2"><a href="#" aria-label="LegalEase on LinkedIn" className={socialClass}><span className="text-xs font-bold">in</span></a><a href="#" aria-label="LegalEase on Facebook" className={socialClass}><span className="text-sm font-bold">f</span></a><a href="#" aria-label="LegalEase on Instagram" className={socialClass}><span className="text-sm font-bold">◎</span></a></div></div>
      <div><h2 className="text-xs font-bold uppercase tracking-[0.14em] text-white">Explore</h2><div className="mt-4 grid gap-3 text-sm"><Link to="/lawyers" className="transition hover:text-amber-200">Browse lawyers</Link><Link to="/about" className="transition hover:text-amber-200">About LegalEase</Link><Link to="/contact" className="transition hover:text-amber-200">Contact</Link></div></div>
      <div><h2 className="text-xs font-bold uppercase tracking-[0.14em] text-white">Stay informed</h2><p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">Newsletter updates are coming soon. Explore the legal directory in the meantime.</p><Link to="/privacy" className="mt-4 inline-block text-sm font-semibold text-amber-200 transition hover:text-amber-100">Privacy policy <span aria-hidden="true">→</span></Link></div>
    </div>
    <div className="border-t border-slate-800"><p className="mx-auto w-full max-w-6xl px-4 py-5 text-center text-xs text-slate-500 sm:px-6">© {new Date().getFullYear()} LegalEase. All rights reserved by Mesbah Ghalib.</p></div>
  </footer>
}
