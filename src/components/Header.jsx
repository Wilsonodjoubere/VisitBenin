import React from 'react'
import useTourStore from '../store/useTourStore'
import styles from './Header.module.css'

const STEPS = [
  { n: 1, label: 'Zones' },
  { n: 2, label: 'Sites' },
  { n: 3, label: 'Parcours' },
]

export default function Header() {
  const { step, setStep, selectedZones, selectedSites } = useTourStore()

  const canGoTo = (n) => {
    if (n === 1) return true
    if (n === 2) return selectedZones.length > 0
    if (n === 3) return selectedSites.length > 0
    return false
  }

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div className={styles.logo}>
          <span className={styles.logoName}>BeninTours</span>
          <span className={styles.logoTagline}>Planificateur de circuit</span>
        </div>
        <div className={styles.meta}>6 zones · 40+ sites</div>
      </div>
      <nav className={styles.stepsBar} aria-label="Étapes">
        {STEPS.map(({ n, label }) => {
          const done = n < step
          const active = n === step
          const clickable = canGoTo(n)
          return (
            <button
              key={n}
              className={`${styles.stepBtn} ${active ? styles.active : ''} ${done ? styles.done : ''}`}
              onClick={() => clickable && setStep(n)}
              disabled={!clickable}
              aria-current={active ? 'step' : undefined}
            >
              <span className={styles.stepNum}>{done ? '✓' : n}</span>
              <span className={styles.stepLabel}>{label}</span>
            </button>
          )
        })}
      </nav>
    </header>
  )
}
