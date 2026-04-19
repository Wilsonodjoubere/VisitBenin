import React from 'react'
import Header from './components/Header'
import ZoneSelector from './components/ZoneSelector'
import SiteChooser from './components/SiteChooser'
import ParcoursResult from './components/ParcoursResult'
import useTourStore from './store/useTourStore'

export default function App() {
  const { step } = useTourStore()

  return (
    <div className="app-shell">
      <Header />
      <main>
        {step === 1 && <ZoneSelector />}
        {step === 2 && <SiteChooser />}
        {step === 3 && <ParcoursResult />}
      </main>
    </div>
  )
}
