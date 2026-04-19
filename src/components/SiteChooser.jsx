import React from 'react'
import useTourStore from '../store/useTourStore'
import { TYPE_LABELS, TYPE_COLORS } from '../data'
import styles from './SiteChooser.module.css'

function Stars({ rating }) {
  return (
    <div className={styles.stars} aria-label={`${rating} étoiles sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? styles.starFull : styles.starEmpty}>
          ★
        </span>
      ))}
    </div>
  )
}

function formatPrice(price, currency = 'FCFA') {
  if (price === 0) return 'Gratuit'
  if (currency === 'FCFA') return price.toLocaleString('fr-FR') + ' FCFA'
  if (currency === 'EUR') return '€' + Math.round(price * 0.00152)
  return '$' + Math.round(price * 0.00165)
}

export default function SiteChooser() {
  const {
    selectedSites, toggleSite,
    days, setDays,
    currency,
    filterType, setFilterType,
    getFilteredSites, getSitesForZones,
    prevStep, nextStep,
  } = useTourStore()

  const allSites = getSitesForZones()
  const filtered = getFilteredSites()
  const types = ['all', ...new Set(allSites.map((s) => s.type))]

  return (
    <section className={`${styles.container} fade-in`}>
      <h2 className={`${styles.title} font-display`}>Choisissez vos sites</h2>
      <p className={styles.sub}>
        {allSites.length} sites disponibles — cochez ceux qui vous intéressent.
      </p>

      {/* Filters */}
      <div className={styles.filterRow}>
        {types.map((t) => (
          <button
            key={t}
            className={`${styles.filterBtn} ${filterType === t ? styles.filterActive : ''}`}
            onClick={() => setFilterType(t)}
          >
            {t === 'all' ? 'Tous' : TYPE_LABELS[t] || t}
          </button>
        ))}
      </div>

      {/* Days picker */}
      <div className={styles.daysRow}>
        <span className={styles.daysLabel}>Durée du séjour :</span>
        <button className={styles.daysBtn} onClick={() => setDays(days - 1)} aria-label="Moins">−</button>
        <span className={styles.daysVal}>{days} j</span>
        <button className={styles.daysBtn} onClick={() => setDays(days + 1)} aria-label="Plus">+</button>
        <span className={styles.daysInfo}>
          {selectedSites.length} site{selectedSites.length !== 1 ? 's' : ''} sélectionné{selectedSites.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Site list */}
      <div className={styles.list}>
        {filtered.map((site) => {
          const isSelected = selectedSites.includes(site.id)
          const typeColor = TYPE_COLORS[site.type] || '#888'
          return (
            <div
              key={site.id}
              className={`${styles.siteItem} ${isSelected ? styles.siteSelected : ''}`}
              onClick={() => toggleSite(site.id)}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => e.key === ' ' && toggleSite(site.id)}
            >
              <div className={`${styles.checkbox} ${isSelected ? styles.checkboxOn : ''}`}>
                {isSelected && <span className={styles.checkIcon}>✓</span>}
              </div>

              <div className={styles.siteBody}>
                <div className={styles.siteName}>{site.name}</div>
                <div className={styles.siteType} style={{ color: typeColor }}>
                  {TYPE_LABELS[site.type]}
                </div>
                <div className={styles.siteShort}>{site.short}</div>
                <div className={styles.siteMeta}>
                  <span className={styles.badgeTime}>⏱ {site.dur}h</span>
                  <span className={styles.badgePrice}>{formatPrice(site.price, currency)}</span>
                  {site.hotel
                    ? <span className={styles.badgeHotel}>🏨 Hôtel dispo</span>
                    : <span className={styles.badgeNoHotel}>Excursion</span>
                  }
                </div>
                <Stars rating={site.rating} />
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.footer}>
        <button className={styles.btnSecondary} onClick={prevStep}>← Zones</button>
        <button
          className={styles.btnGreen}
          onClick={nextStep}
          disabled={selectedSites.length === 0}
        >
          Générer le parcours ↗
        </button>
        <span className={styles.countLabel}>
          <strong>{selectedSites.length}</strong> site{selectedSites.length !== 1 ? 's' : ''} choisi{selectedSites.length !== 1 ? 's' : ''}
        </span>
      </div>
    </section>
  )
}
