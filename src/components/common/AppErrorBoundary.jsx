import { Component } from 'react'
export default class AppErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  render() { if (!this.state.failed) return this.props.children; return <main className="mx-auto grid min-h-screen max-w-xl place-items-center px-6 text-center"><section><p className="text-xs font-bold uppercase tracking-[.18em] text-indigo-700">LegalEase</p><h1 className="mt-3 text-3xl font-bold text-slate-950 dark:text-[#ece5d6]">Something went wrong</h1><p className="mt-3 text-slate-600 dark:text-[#a8bbcc]">Please refresh this page or return to a safe starting point.</p><div className="mt-6 flex justify-center gap-3"><button className="le-button le-button-primary" onClick={() => window.location.reload()}>Try again</button><a className="le-button le-button-secondary" href="/">Go home</a></div></section></main> }
}
