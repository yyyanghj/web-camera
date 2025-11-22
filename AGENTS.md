# Project Context for AI Agents

## 📸 Project Overview
**Web Camara** is a web-based camera simulator designed to help photography beginners understand the exposure triangle (ISO, Aperture, Shutter Speed) and other fundamental concepts. It provides a safe, virtual environment to experiment with camera settings and see simulated real-time results.

## 🛠️ Tech Stack
- **Framework**: Svelte 5 (Runes mode) & SvelteKit
- **Styling**: Tailwind CSS 4 (Native, no config required for standard usage)
- **Language**: TypeScript
- **Icons**: `lucide-svelte`
- **Testing**: Vitest & Playwright (if applicable)

## 📂 Directory Structure
- **`src/lib/components`**: Reusable UI components (e.g., `CameraControls`, `Viewfinder`).
- **`src/lib/stores`**: Global state management (using Svelte 5 `$state` or `svelte/store` if legacy).
- **`src/lib/utils`**: Helper functions and logic (e.g., exposure calculations).
- **`src/routes`**: SvelteKit file-based routing.
- **`static`**: Static assets (images, fonts).

## 📝 Coding Conventions
- **Reactivity**: ALWAYS use Svelte 5 Runes (`$state`, `$derived`, `$effect`, `$props`) for new code. Avoid legacy `export let` or `$:`.
- **Styling**: Use Tailwind CSS utility classes directly in markup. Avoid `@apply` unless necessary for complex reuse.
- **Icons**: Import icons from `lucide-svelte`.
- **Type Safety**: Use TypeScript for all components and logic. Define interfaces/types for props and state.
- **Component Structure**: Keep components small, focused, and composable.

---

## 🤖 MCP Tool Usage Guide

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
