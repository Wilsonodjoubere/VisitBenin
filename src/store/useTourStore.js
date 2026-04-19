import { create } from 'zustand'
import { SITES } from '../data'

const useTourStore = create((set, get) => ({
  // ─── Navigation ──────────────────────────────────────────────────────────
  step: 1,
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 3) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),

  // ─── Zone selection ───────────────────────────────────────────────────────
  selectedZones: [],
  toggleZone: (zoneId) =>
    set((s) => {
      const already = s.selectedZones.includes(zoneId)
      const selectedZones = already
        ? s.selectedZones.filter((id) => id !== zoneId)
        : [...s.selectedZones, zoneId]

      // Remove sites from deselected zone
      const selectedSites = already
        ? s.selectedSites.filter((id) => SITES[id]?.zone !== zoneId)
        : s.selectedSites

      return { selectedZones, selectedSites }
    }),

  // ─── Site selection ───────────────────────────────────────────────────────
  selectedSites: [],
  toggleSite: (siteId) =>
    set((s) => {
      const already = s.selectedSites.includes(siteId)
      return {
        selectedSites: already
          ? s.selectedSites.filter((id) => id !== siteId)
          : [...s.selectedSites, siteId],
      }
    }),
  selectAllInZone: (zoneId, zoneSiteIds) =>
    set((s) => {
      const rest = s.selectedSites.filter((id) => SITES[id]?.zone !== zoneId)
      return { selectedSites: [...rest, ...zoneSiteIds] }
    }),
  clearAllInZone: (zoneId) =>
    set((s) => ({
      selectedSites: s.selectedSites.filter((id) => SITES[id]?.zone !== zoneId),
    })),

  // ─── Trip settings ────────────────────────────────────────────────────────
  days: 7,
  setDays: (days) => set({ days: Math.max(1, Math.min(30, days)) }),
  currency: 'FCFA',
  setCurrency: (currency) => set({ currency }),
  filterType: 'all',
  setFilterType: (filterType) => set({ filterType }),

  // ─── Derived helpers ──────────────────────────────────────────────────────
  getSelectedSiteObjects: () => {
    const { selectedSites } = get()
    return selectedSites
      .map((id) => ({ id, ...SITES[id] }))
      .filter(Boolean)
  },

  getSitesForZones: () => {
    const { selectedZones } = get()
    return Object.entries(SITES)
      .filter(([, site]) => selectedZones.includes(site.zone))
      .map(([id, site]) => ({ id, ...site }))
  },

  getFilteredSites: () => {
    const { filterType } = get()
    const all = get().getSitesForZones()
    return filterType === 'all' ? all : all.filter((s) => s.type === filterType)
  },

  getBudgetBreakdown: () => {
    const { days, currency } = get()
    const sites = get().getSelectedSiteObjects()
    const rates = { FCFA: 1, EUR: 0.00152, USD: 0.00165 }
    const rate = rates[currency] || 1

    const entranceFees = sites.reduce((sum, s) => sum + (s.price || 0), 0)
    const hotelNights = Math.min(days, sites.filter((s) => s.hotel).length)
    const hotelCost = hotelNights * 20000
    const transport = days * 5000
    const food = days * 8000
    const guides = Math.ceil(sites.length / 3) * 15000
    const total = entranceFees + hotelCost + transport + food + guides

    const fmt = (v) => {
      const n = Math.round(v * rate)
      if (currency === 'FCFA') return n.toLocaleString('fr-FR') + ' FCFA'
      if (currency === 'EUR') return '€' + n.toLocaleString('fr-FR')
      return '$' + n.toLocaleString('en-US')
    }

    return {
      entranceFees, hotelCost, transport, food, guides, total,
      hotelNights, fmt,
      rows: [
        { label: 'Droits d\'entrée', value: entranceFees },
        { label: `Hébergement (${hotelNights} nuits)`, value: hotelCost },
        { label: 'Transport & déplacements', value: transport },
        { label: 'Restauration', value: food },
        { label: 'Guides locaux', value: guides },
      ],
    }
  },
}))

export default useTourStore
