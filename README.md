# WorldEstate - Global Real Estate 3D Map

WorldEstate è una webapp Next.js che aggrega annunci immobiliari globali su un globo 3D interattivo con CesiumJS. Ogni annuncio mostra i dati dell'inserzione originale e include il link diretto alla fonte.

## Stack tecnologico

- **Frontend/Backend**: Next.js (App Router), React, TypeScript.
- **UI**: Tailwind CSS, componenti in stile shadcn/ui.
- **Mappa 3D**: CesiumJS + Resium.
- **Database**: PostgreSQL + PostGIS.
- **ORM/Query Layer**: Drizzle ORM + query SQL spaziali.
- **Ingestion**: `fetch` + `cheerio`.

## Prerequisiti

- Node.js 20+
- npm 10+
- PostgreSQL 15+
- Estensione PostGIS abilitata

## Configurazione ambiente

Crea un file `.env.local` nella root del progetto:

```bash
DATABASE_URL=YOUR_DATABASE_URL
CRON_SECRET=una-chiave-segreta-lunga
INGESTION_SOURCE_URL=https://esempio-portale.com/listings
NEXT_PUBLIC_CESIUM_ION_TOKEN=il-tuo-token-cesium-ion
```

## Setup progetto

1. Installa le dipendenze:

```bash
npm install
```

2. Copia gli asset Cesium in `public/cesium`:

```bash
npm run postinstall
```

3. Applica lo schema database:

```bash
npm run db:migrate
```

4. Avvia il server di sviluppo:

```bash
npm run dev
```

5. Apri `http://localhost:3000`.

## Endpoint API

- `GET /api/listings?bbox=west,south,east,north&minPrice=...&maxPrice=...`
  - Restituisce gli annunci nel Bounding Box visibile.
- `POST /api/cron/ingest`
  - Richiede header `x-cron-secret: <CRON_SECRET>` oppure `Authorization` con bearer token equivalente.
  - Esegue il runner di ingestione e salva/aggiorna gli annunci.
- `GET /api/geocode?query=...`
  - Risolve una ricerca testuale in coordinate geografiche.

## Ingestion engine

Il connettore di esempio (`GenericPortalConnector`) esegue scraping reale di una pagina HTML con struttura standard:

- contenitore annuncio: `.listing-card`
- titolo: `.listing-title`
- descrizione: `.listing-description`
- prezzo: `.listing-price`
- link annuncio: `a.listing-link`
- immagine: `img`
- coordinate/id tramite attributi `data-lat`, `data-lng`, `data-id`, `data-currency`

## Scheduling giornaliero (es. Vercel Cron)

Configura una chiamata giornaliera all'endpoint:

- URL: `https://<tuo-dominio>/api/cron/ingest`
- Metodo: `POST`
- Header consigliato: `x-cron-secret: <CRON_SECRET>`

## Note operative

- Tutti i marker sulla mappa aprono una sidebar con dettagli e bottone **"Vedi annuncio originale"**.
- I filtri prezzo min/max e la ricerca geocodifica sono disponibili nella navbar trasparente sovrapposta alla mappa.
