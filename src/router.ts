import type { Route, RouteHandler } from './types';

const routes = new Map<Route, RouteHandler>();
let currentCleanup: (() => void) | null = null;

export function registerRoute(route: Route, handler: RouteHandler): void {
  routes.set(route, handler);
}

export function navigate(route: string): void {
  window.location.hash = route ? `#/${route}` : '#/';
}

function parseHash(): { route: Route; params?: string } {
  const hash = window.location.hash.slice(2) || ''; // remove #/
  const parts = hash.split('/');
  const route = (parts[0] || '') as Route;
  const params = parts.slice(1).join('/');
  return { route, params: params || undefined };
}

function handleRoute(): void {
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  const { route, params } = parseHash();
  const handler = routes.get(route);
  const container = document.getElementById('app');

  if (!container) return;

  if (handler) {
    const cleanup = handler(container, params);
    if (typeof cleanup === 'function') {
      currentCleanup = cleanup;
    }
  } else {
    // Fallback to dashboard
    const dashHandler = routes.get('' as Route);
    if (dashHandler) {
      const cleanup = dashHandler(container);
      if (typeof cleanup === 'function') {
        currentCleanup = cleanup;
      }
    }
  }
}

export function initRouter(): void {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
