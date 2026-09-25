import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  trailingSlash: "always",
  devToolbar: { enabled: false },
  server: { host: "127.0.0.1" },
  vite: {
    build: {
      sourcemap: false,
      rolldownOptions: {
        output: {
          comments: { legal: true },
          postBanner: "/*! Includes GSAP 3.15.0. Copyright (c) 2008-2026, GreenSock. All rights reserved. https://gsap.com/standard-license */",
        },
      },
    },
    server: {
      fs: {
        deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "**/.portfolio-input/**", "**/.agent-context/**"],
      },
    },
  },
});
