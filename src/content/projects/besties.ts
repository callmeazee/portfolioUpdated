import type { Project } from "@/types/content";

/**
 * Written from the repository source (github.com/callmeazee/besties) on
 * 2026-09-08, after it was made public — superseding the earlier record, which
 * came from a README block labelled an "example" and understated the project.
 *
 * The challenge below is the author's own account, given directly. `problem`
 * and `learnings` remain empty for the same reason they do on Snitcher: they
 * cannot be read out of a repository.
 */
export const besties: Project = {
  id: "besties",
  slug: "besties",
  title: "Besties",
  shortTitle: null,
  category: "Social Platform",
  status: "Completed",
  year: null,
  role: "Full-Stack Developer",

  shortDescription:
    "Real-time social platform with a post feed, friends, presence, attachments and one-to-one calling over WebRTC.",

  technologies: [
    { group: "Frontend", items: ["React", "TypeScript", "Vite", "SWR", "Tailwind CSS", "Ant Design"] },
    { group: "Backend", items: ["Node.js", "Express.js", "TypeScript", "JWT", "bcrypt", "Swagger"] },
    { group: "Database", items: ["MongoDB", "Mongoose"] },
    { group: "Real-Time", items: ["Socket.IO", "WebRTC", "Twilio ICE"] },
    { group: "Cloud & Infrastructure", items: ["AWS S3", "Vercel"] },
  ],

  links: {
    live: { status: "available", url: "https://besties-sandy.vercel.app" },
    repository: { status: "available", url: "https://github.com/callmeazee/besties" },
  },

  media: { hero: null, screenshots: [], architectureDiagram: null },

  caseStudy: {
    overview: [
      "Besties is a real-time social platform: a post feed with rich-text authoring, friend relationships, direct messaging with file attachments, live presence, and one-to-one calling built directly on WebRTC.",
      "It is written in TypeScript end to end — a React front end and an Express API — with three separate Socket.IO namespaces handling chat, presence and call signalling.",
    ],
    problem: [],
    solution: [
      "Real-time behaviour is split into three independent socket modules rather than one connection handler: chat, presence and video signalling each own their events, so a change to call setup cannot disturb message delivery.",
      "All three authenticate the same way — the JWT is read from the cookie sent with the socket handshake and verified before the connection is trusted — and each joins the socket to a room named after the user's own id, so events address a person rather than a particular browser tab.",
      "Calling is built on the browser's native WebRTC APIs rather than a wrapper library, with Socket.IO carrying the offer, answer and ICE candidate exchange, and Twilio issuing the ICE servers so connections survive NAT.",
    ],
    features: [
      "Email and password authentication with bcrypt hashing and refresh-token rotation",
      "Post feed with rich-text authoring",
      "Friend relationships",
      "Direct messaging with file attachments",
      "Live presence — online users broadcast as they connect and disconnect",
      "One-to-one audio and video calling over WebRTC",
      "Media stored on S3 and served through presigned URLs",
      "API documented with Swagger",
    ],
    architecture: {
      summary:
        "A TypeScript React client and Express API sharing one MongoDB, with real-time behaviour separated into three Socket.IO modules — chat, presence and video signalling.",
      points: [
        "The API is layered: routes → controllers → Mongoose models, with authentication and refresh-token handling as separate middleware.",
        "Each socket module authenticates independently from the handshake cookie, so an unauthenticated connection cannot address another user's room.",
        "Users join a room keyed by their user id, so a message or call reaches the person rather than one specific connection.",
        "The REST surface is documented with Swagger and served from the API itself.",
      ],
    },
    diagram: {
      caption:
        "The client holds two connections: ordinary HTTP to the Express API, and a Socket.IO connection authenticated at the handshake from the JWT cookie. Three socket modules run over it — chat, presence and call signalling — and each joins the socket to a room named after the user's own id, so events address a person rather than a browser tab. Signalling only introduces the two peers; once connected, call media flows directly between browsers and never passes through the server.",
      layers: [
        {
          label: "Client",
          nodes: [
            { id: "spa", label: "React SPA", detail: "TypeScript, SWR, deployed on Vercel" },
          ],
        },
        {
          label: "Real time — Socket.IO",
          nodes: [
            { id: "chat", label: "Chat", detail: "messages and attachments" },
            { id: "presence", label: "Presence", detail: "who is online" },
            { id: "signal", label: "Signalling", detail: "offer · answer · ICE" },
          ],
        },
        {
          label: "API — Express",
          nodes: [
            { id: "routes", label: "Routes + controllers", detail: "auth · chat · friends · posts" },
            { id: "auth", label: "Auth middleware", detail: "access and refresh tokens" },
          ],
        },
        {
          label: "Data",
          nodes: [
            { id: "mongo", label: "MongoDB", detail: "auth · chat · friends · posts" },
          ],
        },
        {
          label: "Third party",
          nodes: [
            { id: "s3", label: "AWS S3", detail: "media, via presigned URLs" },
            { id: "twilio", label: "Twilio", detail: "ICE servers for NAT traversal" },
          ],
        },
      ],
      flows: [
        { from: "React SPA", to: "Socket.IO", label: "JWT verified at the handshake, then joined to a room keyed by user id" },
        { from: "Signalling", to: "Peer browser", label: "offer, answer and ICE candidates relayed between users" },
        { from: "Peer browser", to: "Peer browser", label: "call media flows directly over WebRTC, never through the server" },
        { from: "React SPA", to: "AWS S3", label: "attachments uploaded and fetched with presigned URLs" },
        { from: "Chat", to: "MongoDB", label: "messages persisted on receipt, so history survives a disconnect" },
      ],
    },
    frontend: {
      summary:
        "A TypeScript React application using SWR for data fetching and a Socket.IO client for live updates, with rich-text authoring for posts.",
      points: [
        "Organised by concern — components, modals, hooks, guards, services and shared types.",
        "Route guards separate authenticated areas from public ones.",
        "SWR handles fetching and revalidation, so socket events update views already held in cache.",
      ],
    },
    backend: {
      summary:
        "An Express API in TypeScript using cookie-based JWTs with a dedicated refresh middleware, so short-lived access tokens can be renewed without forcing a re-login.",
      points: [
        "Access and refresh tokens are handled by separate middleware rather than one combined auth check.",
        "Chat messages are persisted through the same controller the REST API uses, so a message sent over the socket and one loaded from history take the same path.",
        "CORS configuration is extracted into its own module rather than inlined into the app.",
      ],
    },
    database: {
      summary:
        "MongoDB via Mongoose, with separate models for authentication, chat, friend relationships and posts.",
      points: [
        "Chat messages are persisted on receipt, so history survives a disconnect and is not held only in socket memory.",
        "Friend relationships are modelled explicitly rather than embedded in the user document.",
      ],
    },
    realtime: {
      summary:
        "Three Socket.IO modules: chat delivery, presence broadcasting, and WebRTC signalling — each authenticated from the handshake cookie and addressing users by id.",
      points: [
        "Signalling relays offer, answer, ICE candidate and end events between users; the media itself never touches the server.",
        "Twilio issues the ICE servers, so calls can traverse NAT rather than only working on the same network.",
        "Presence is kept in an in-memory map of connected sockets and broadcast to all clients as people connect and disconnect.",
        "Attachments are uploaded to S3 and the message carries the object reference, so the socket never transports file bytes.",
      ],
    },
    infrastructure: {
      summary:
        "The client is deployed on Vercel; media lives in S3 and is served through presigned URLs rather than proxied by the API.",
      points: [
        "Presigned URLs mean uploads and downloads go straight to S3, keeping large files off the application server.",
      ],
    },
    security: {
      summary:
        "Sockets are authenticated at the handshake, not after connection, so an unauthenticated client is never joined to a user's room.",
      points: [
        "Passwords are hashed with bcrypt.",
        "The JWT is read from the handshake cookie and verified before the socket joins any room.",
        "Refresh-token rotation is handled in its own middleware, keeping access tokens short-lived.",
      ],
    },
    performance: { measured: false },
    challenges: [
      {
        title: "Calls and messages that silently stopped responding",
        /* The author's own account, given directly on 2026-09-08. */
        problem:
          "The hardest part was not building the call or the chat box, but making them behave predictably. During development both would regularly appear to stop responding — a call would sit waiting for the other side, or a message would be sent with nothing visibly happening.",
        approach:
          "Real-time failures are hard to read because nothing throws: the connection is open, the event fires, and the interface simply does not change. The design that came out of it addresses users rather than connections — every socket joins a room named after its own user id, authenticated from the handshake cookie — so a message or call offer reaches a person regardless of which tab or device they are on, and signalling is separated from chat and presence so one failing path cannot take the others with it.",
      },
    ],
    learnings: [],
  },

  /*
   * Featured: it is now the deepest case study on the site and the only project
   * demonstrating WebRTC, so it earns a place on the homepage.
   */
  featured: true,
  order: 3,
};
