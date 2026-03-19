'use client'

import { Component } from 'react'

/** Catches TradingView iframe errors so they don't break the dashboard */
export class ChartErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-64 rounded-lg border border-[#1f2937] bg-[#050816] flex items-center justify-center text-xs text-slate-500 px-4 text-center">
          Chart temporarily unavailable. Try refreshing or check your connection.
        </div>
      )
    }
    return this.props.children
  }
}
