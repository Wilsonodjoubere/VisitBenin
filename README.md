# BeninTours — Planificateur de Circuit Touristique

Application React pour créer des parcours touristiques personnalisés au Bénin, avec estimation de budget en temps réel.

## Fonctionnalités

- **6 zones du Bénin** : Littoral, Zou, Borgou, Ouémé, Mono, Atacora
- **40+ sites touristiques** avec durée, prix d'entrée, disponibilité hôtel, note et conseils pratiques
- **Filtrage par type** : Historique, Culturel, Nature, Plage
- **Parcours optimisé automatiquement** : historique → culturel → nature → plage
- **Budget détaillé** en FCFA, EUR et USD
- **Gestion de la durée** du séjour (1 à 30 jours)

## Stack technique

| Outil | Rôle |
|-------|------|
| React 18 | UI |
| Zustand 4 | State management |
| CSS Modules | Styles scopés |
| Vite 5 | Build & dev server |

## Installation

```bash
# Cloner / décompresser le projet
cd benin-tours

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build de production
npm run build
```

## Structure du projet

```
benin-tours/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              # Point d'entrée React
    ├── App.jsx               # Routeur d'étapes
    ├── data/
    │   └── index.js          # Zones, sites, constantes
    ├── store/
    │   └── useTourStore.js   # Store Zustand (état global)
    ├── styles/
    │   └── global.css        # Design tokens + reset
    └── components/
        ├── Header.jsx        # Navigation par étapes
        ├── Header.module.css
        ├── ZoneSelector.jsx  # Étape 1 — choix des zones
        ├── ZoneSelector.module.css
        ├── SiteChooser.jsx   # Étape 2 — choix des sites
        ├── SiteChooser.module.css
        ├── ParcoursResult.jsx # Étape 3 — parcours généré
        ├── ParcoursResult.module.css
        ├── BudgetSummary.jsx  # Widget budget réutilisable
        └── BudgetSummary.module.css
```

## Architecture — Store Zustand

```js
useTourStore {
  // Navigation
  step: 1 | 2 | 3
  setStep(n), nextStep(), prevStep()

  // Sélections
  selectedZones: string[]   // IDs des zones
  toggleZone(zoneId)

  selectedSites: string[]   // IDs des sites
  toggleSite(siteId)

  // Paramètres
  days: number              // Durée du séjour
  currency: 'FCFA' | 'EUR' | 'USD'
  filterType: 'all' | 'historic' | 'cultural' | 'nature' | 'beach'

  // Sélecteurs dérivés
  getSelectedSiteObjects()  // → Site[]
  getSitesForZones()        // → Site[] filtrés par zones
  getFilteredSites()        // → Site[] filtrés par zone + type
  getBudgetBreakdown()      // → { rows, total, fmt() }
}
```

## Ajouter un site

Dans `src/data/index.js`, ajouter une entrée dans `SITES` :

```js
'mon-nouveau-site': {
  name: 'Nom du site',
  type: 'historic',       // 'historic' | 'cultural' | 'nature' | 'beach'
  zone: 'littoral',       // ID de la zone
  dur: 3,                 // Durée en heures
  price: 2000,            // Prix entrée en FCFA (0 = gratuit)
  hotel: true,            // Hébergement disponible à proximité
  rating: 4,              // Note 1-5
  short: 'Description courte',
  tip: 'Conseil pratique détaillé pour le visiteur.',
},
```

Puis l'ajouter au tableau `sites` de la zone correspondante dans `ZONES`.

## Ajouter une zone

Dans `src/data/index.js`, ajouter une entrée dans `ZONES` :

```js
{
  id: 'ma-zone',
  name: 'Nom de la Zone',
  icon: '🏔️',
  dept: 'Ville · Ville · Ville',
  color: '#hexcode',
  description: 'Description courte de la zone',
  sites: ['site-id-1', 'site-id-2'],
},
```

## Personnalisation du budget

Les taux de base sont dans `useTourStore.js` → `getBudgetBreakdown()` :

```js
const hotelCost  = hotelNights * 20000  // FCFA/nuit
const transport  = days * 5000          // FCFA/jour
const food       = days * 8000          // FCFA/jour
const guides     = ceil(sites/3) * 15000 // par groupe de 3 sites
```

Adapter ces valeurs selon vos tarifs réels.

## Licence

MIT — Projet open source, contributions bienvenues.
