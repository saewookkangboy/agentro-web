/**
 * Source entry for the Vercel Express function.
 * Bundled to root `server.js` by `pnpm run build:vercel-server`.
 */
import express from "express";
import { createApp } from "./_core/app";
import { serveStatic } from "./_core/serveStatic";

const app: ReturnType<typeof express> = createApp();
serveStatic(app);

export default app;
