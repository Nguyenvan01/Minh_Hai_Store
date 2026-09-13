import React from 'react'
import Header from '../Header'
import Footer from '../Footer'
import AccountSidebar from '../AccountSidebar'

function AccountLoading() {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-12 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-[#e5e7eb] border-t-[#d71920] animate-spin" />
    </div>
  )
}

function AccountLayout({ activeId, children, loading = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header />

      <main className="pt-20 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar activeId={activeId} />

          <section className="flex-1 min-w-0">
            {loading ? <AccountLoading /> : children}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default AccountLayout
