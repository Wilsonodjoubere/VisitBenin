import React from 'react'
import useTourStore from '../store/useTourStore'
import { ZONES } from '../data'
import styles from './ZoneSelector.module.css'

export default function ZoneSelector() {
  const { selectedZones, toggleZone, nextStep } = useTourStore()

  return (
    <section className={`${styles.container} fade-in`}>
      <h2 className={`${styles.title} font-display`}>Choisissez vos zones</h2>
      <p className={styles.sub}>
        Sélectionnez une ou plusieurs régions — vous affinez les sites à l'étape suivante.
      </p>

      <div className={styles.grid}>
        {ZONES.map((zone) => {
          const isSelected = selectedZones.includes(zone.id)
          return (
            <button
              key={zone.id}
              className={`${styles.card} ${isSelected ? styles.selected : ''}`}
              onClick={() => toggleZone(zone.id)}
              aria-pressed={isSelected}
            >
              <div
                className={styles.colorBar}
                style={{ background: zone.color }}
              />
              <div className={styles.cardInner}>
                <div className={styles.icon}>{zone.icon}</div>
                <div className={styles.zoneName}>{zone.name}</div>
                <div className={styles.zoneDept}>{zone.dept}</div>
                <div className={styles.zoneDesc}>{zone.description}</div>
                <div className={styles.zoneCount}>{zone.sites.length} sites</div>
              </div>
              {isSelected && (
                <div className={styles.checkBadge} aria-hidden="true">✓</div>
              )}
            </button>
          )
        })}
      </div>

      <div className={styles.footer}>
        <button
          className={styles.btnPrimary}
          onClick={nextStep}
          disabled={selectedZones.length === 0}
        >
          Voir les sites →
        </button>
        <span className={styles.countLabel}>
          {selectedZones.length === 0
            ? 'Sélectionnez au moins une zone'
            : `${selectedZones.length} zone${selectedZones.length > 1 ? 's' : ''} sélectionnée${selectedZones.length > 1 ? 's' : ''}`}
        </span>
      </div>
    </section>
  )
}
