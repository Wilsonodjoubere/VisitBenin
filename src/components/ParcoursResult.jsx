import React from 'react'
import useTourStore from '../store/useTourStore'
import { TYPE_LABELS, TYPE_COLORS, TYPE_ORDER } from '../data'
import BudgetSummary from './BudgetSummary'
import styles from './ParcoursResult.module.css'

const TYPE_BG = {
  historic: '#8B4513',
  cultural: '#2D6A4F',
  nature:   '#2D7DB3',
  beach:    '#4ECDC4',
}

export default function ParcoursResult() {
  const { days, prevStep, getSelectedSiteObjects, getBudgetBreakdown } = useTourStore()
  const allSites = getSelectedSiteObjects()
  const budget = getBudgetBreakdown()

  // Sort by type order: historic → cultural → nature → beach
  const sites = [...allSites].sort(
    (a, b) => (TYPE_ORDER[a.type] || 9) - (TYPE_ORDER[b.type] || 9)
  )

  const totalHours = sites.reduce((s, x) => s + (x.dur || 0), 0)

  return (
    <section className={`${styles.container} fade-in`}>
      {/* Circuit header */}
      <div className={styles.circuitHeader}>
        <div className={`${styles.circuitTitle} font-display`}>
          Circuit Bénin — {days} jours
        </div>
        <div className={styles.circuitStats}>
          <div className={styles.stat}>
            <span className={styles.statVal}>{sites.length}</span>
            <span className={styles.statLbl}>Sites</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statVal}>{totalHours}h</span>
            <span className={styles.statLbl}>Visites</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statVal}>{days}</span>
            <span className={styles.statLbl}>Jours</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statVal}>{budget.fmt(budget.total)}</span>
            <span className={styles.statLbl}>Budget total</span>
          </div>
        </div>
      </div>

      {/* Tip */}
      <div className={styles.tipBox}>
        💡 Ordre optimisé automatiquement : sites historiques → culturels → naturels → plages.
        Chaque étape inclut des conseils pratiques de terrain.
      </div>

      {/* Parcours steps */}
      <h3 className={`${styles.sectionTitle} font-display`}>Votre circuit étape par étape</h3>
      <div className={styles.steps}>
        {sites.map((site, i) => (
          <div key={site.id} className={styles.step}>
            <div className={styles.stepLeft}>
              <div
                className={styles.stepDot}
                style={{ background: TYPE_BG[site.type] || '#888' }}
              >
                {i + 1}
              </div>
              {i < sites.length - 1 && <div className={styles.stepLine} />}
            </div>
            <div className={styles.stepBody}>
              <div className={styles.stepName}>{site.name}</div>
              <div
                className={styles.stepType}
                style={{ color: TYPE_COLORS[site.type] }}
              >
                {TYPE_LABELS[site.type]}
              </div>
              <div className={styles.stepTip}>{site.tip}</div>
              <div className={styles.stepBadges}>
                <span className={styles.badgeTime}>⏱ {site.dur}h</span>
                <span className={styles.badgePrice}>
                  {site.price === 0 ? 'Gratuit' : site.price.toLocaleString('fr-FR') + ' FCFA'}
                </span>
                {site.hotel && <span className={styles.badgeHotel}>🏨 Hébergement</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Budget */}
      <h3 className={`${styles.sectionTitle} font-display`}>Budget détaillé</h3>
      <BudgetSummary />

      {/* Footer actions */}
      <div className={styles.footer}>
        <button className={styles.btnSecondary} onClick={prevStep}>
          ← Modifier les sites
        </button>
        <button
          className={styles.btnPrint}
          onClick={() => window.print()}
        >
          🖨 Imprimer
        </button>
      </div>
    </section>
  )
}
