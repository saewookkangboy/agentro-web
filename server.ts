/**
 * Vercel Express entrypoint.
 * @see https://vercel.com/docs/frameworks/backend/express
 */
import express from "express";
import { createApp } from "./server/_core/app";
import { serveStatic } from "./server/_core/serveStatic";

const app: ReturnType<typeof express> = createApp();
serveStatic(app);

export default app;
