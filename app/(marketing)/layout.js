import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function MarketingLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col min-w-0 max-w-full overflow-x-clip">
      <Header />
      <main className="flex-1 min-w-0 w-full overflow-x-clip">{children}</main>
      <Footer />
    </div>
  )
}
