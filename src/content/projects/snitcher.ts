import type { Project } from "@/types/content";

/**
 * Sourced from the résumé supplied 2026-09-02, which supersedes the working
 * name "E-commerce Platform" used in the planning documents.
 */
export const snitcher: Project = {
  id: "snitcher",
  slug: "snitcher",
  title: "Snitcher",
  shortTitle: null,
  category: "E-commerce",
  status: "Completed",
  year: null,
  role: "Full-Stack Developer",

  shortDescription:
    "Full-stack commerce platform with a variant-based catalogue, Google and password sign-in, a persistent cart, and Razorpay payments verified server-side.",

  technologies: [
    { group: "Frontend", items: ["React", "Vite", "Redux Toolkit"] },
    {
      group: "Backend",
      items: [
        "Node.js",
        "Express.js",
        "JWT",
        "Passport (Google OAuth)",
        "Razorpay",
        "express-validator",
        "bcryptjs",
        "Multer",
      ],
    },
    { group: "Database", items: ["MongoDB", "Mongoose"] },
    { group: "Cloud & Infrastructure", items: ["Vercel", "ImageKit"] },
  ],

  links: {
    live: { status: "available", url: "https://snitcher-six.vercel.app" },
    /* Verified: the repository's `homepage` field is exactly the live URL above. */
    repository: { status: "available", url: "https://github.com/callmeazee/snitcher" },
  },

  media: {
    /* Captured from the live deployment on 2026-09-02. */
    hero: {
      src: "/projects/snitcher.webp",
      alt: "The Snitcher storefront, showing the product catalogue with pricing.",
    },
    screenshots: [],
    architectureDiagram: null,
  },

  caseStudy: {
    /*
     * Written from the repository source (github.com/callmeazee/snitcher) on
     * 2026-09-08, not from recollection — every claim below is traceable to a
     * file in that repo.
     *
     * `problem`, `challenges` and `learnings` remain empty because they are the
     * author's own account and cannot be derived from code. They are the one
     * part of this page that still needs writing (ISS-009).
     */
    overview: [
      "Snitcher is a full-stack commerce platform covering the whole path a shopper takes — browsing a variant-based catalogue, building a cart, paying through Razorpay, and having the order recorded — with a seller-facing side for managing products.",
      "It is built as a conventional three-tier application: a React front end, an Express API, and MongoDB, with product imagery served from ImageKit.",
    ],
    problem: [],
    solution: [
      "The API is split into deliberate layers rather than routes-with-logic-inside. Routes delegate to controllers, controllers to services and a DAO layer, and request shapes are checked by a separate validator layer before any handler runs. Data access is confined to the DAO and Mongoose models.",
      "The commerce logic is deliberately server-authoritative. Cart contents, discounts and the final payable amount are all computed on the server from persisted state, so a modified client cannot alter what is charged.",
    ],
    features: [
      "Email and password authentication with bcrypt-hashed credentials",
      "Google sign-in via Passport OAuth 2.0",
      "Role-separated access — buyer and seller",
      "Variant-based product catalogue with per-variant stock, images and pricing",
      "Multi-currency prices (INR, USD, EUR, GBP, JPY)",
      "Server-side persistent cart",
      "Coupon discounts applied server-side",
      "Razorpay checkout with server-side signature verification",
      "Order records that snapshot their items at purchase time",
      "Seller product management with image upload",
    ],
    architecture: {
      summary:
        "A three-tier application with a strictly layered API: routes → controllers → services and DAO → Mongoose models, with validation running ahead of the handlers.",
      points: [
        "Routes are split by domain — /api/auth, /api/products, /api/cart — and mounted on a single Express app.",
        "Controllers hold request handling only; Razorpay and ImageKit calls live in the service layer, and queries live in the DAO layer.",
        "A separate validator layer (express-validator) checks request shape before a controller runs, so handlers can assume valid input.",
        "The React front end is organised by feature, with app-level state kept apart from feature components.",
      ],
    },
    frontend: {
      summary:
        "A React single-page application built with Vite, organised by feature rather than by file type, and deployed as a static bundle on Vercel.",
      points: [
        "Feature-first structure: app, components, context, features.",
        "Routing rewrites are handled at the platform level so deep links resolve to the SPA.",
      ],
    },
    backend: {
      summary:
        "An Express API using cookie-based JWT sessions, with a middleware chain that authenticates the request and then authorises by role.",
      points: [
        "JWTs are read from an httpOnly cookie, falling back to an Authorization bearer header, so browser and API clients share one auth path.",
        "Authentication re-loads the user from the database on each request rather than trusting the token payload, so a deleted or changed account takes effect immediately.",
        "Authorisation is a separate middleware: seller-only routes reject a valid buyer token with 403 rather than 401, distinguishing 'not you' from 'not logged in'.",
        "Requests are logged with morgan; CORS is configured to allow credentials so cookie auth works cross-origin.",
      ],
    },
    database: {
      summary:
        "MongoDB via Mongoose, modelling products as documents with embedded variants, and orders that snapshot their contents rather than referencing live products.",
      points: [
        "Products embed a variants array, each with its own images, stock and price — so a size or colour can be priced and stocked independently.",
        "Variant attributes use a Map, so a new attribute needs no schema change.",
        "Price is a reusable embedded sub-schema of amount plus a currency enum, applied consistently to products, variants, carts and orders.",
        "Carts are persisted per user and reference product and variant by id, so a cart survives across sessions and devices.",
        "Orders copy title, images, description, quantity and price at the moment of purchase. Editing or deleting a product afterwards cannot rewrite what a customer bought.",
      ],
    },
    realtime: null,
    infrastructure: {
      summary:
        "The front end is deployed on Vercel as a static build; product imagery is offloaded to ImageKit rather than served from the application.",
      points: [
        "Uploads are received with Multer and handed to ImageKit, so image delivery does not consume API bandwidth.",
        "Configuration is centralised in a single config module rather than reading process.env throughout the codebase.",
      ],
    },
    security: {
      summary:
        "The commerce path is server-authoritative: the amount charged is computed on the server, and the payment result is cryptographically verified before an order is accepted.",
      points: [
        "Passwords are hashed with bcrypt in a pre-save hook, and the hash step is skipped for OAuth accounts that have no password.",
        "Password comparison returns false outright for accounts with no password, so an OAuth-only account cannot be logged into with an empty credential.",
        "Razorpay orders are created server-side from the persisted cart. The client never supplies the amount.",
        "Coupon codes are resolved and capped on the server, so a discount cannot be forged from the client.",
        "The Razorpay signature is verified server-side with the platform's own HMAC helper before payment is marked paid.",
        "Payment records carry an explicit status — pending, paid or failed — rather than inferring success from the client returning.",
      ],
    },
    /* content.md §20 — never invent performance numbers. */
    performance: { measured: false },
    challenges: [],
    learnings: [],
  },
  featured: true,
  order: 2,
};
