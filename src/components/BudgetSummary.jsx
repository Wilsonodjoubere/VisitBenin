import React from 'react'
import useTourStore from '../store/useTourStore'
import styles from './BudgetSummary.module.css'

export default function BudgetSummary() {
  const { currency, setCurrency, getBudgetBreakdown } = useTourStore()
  const budget = getBudgetBreakdown()

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>Budget détaillé</div>

      <div className={styles.currencyRow}>
        {['FCFA', 'EUR', 'USD'].map((cur) => (
          <button
            key={cur}
            className={`${styles.curBtn} ${currency === cur ? styles.curActive : ''}`}
            onClick={() => setCurrency(cur)}
          >
            {cur}
          </button>
        ))}
      </div>

      <div className={styles.rows}>
        {budget.rows.map((row) => (
          <div key={row.label} className={styles.row}>
            <span className={styles.rowLabel}>{row.label}</span>
            <span className={styles.rowValue}>{budget.fmt(row.value)}</span>
          </div>
        ))}
        <div className={`${styles.row} ${styles.rowTotal}`}>
          <span>Total estimé</span>
          <span>{budget.fmt(budget.total)}</span>
        </div>
      </div>

      <p className={styles.note}>
        Estimation basée sur des tarifs moyens en 2024. Les prix peuvent varier selon la saison et la négociation.
      </p>
    </div>
  )
}
