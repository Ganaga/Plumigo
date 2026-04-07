import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Achievement } from '../types';

@customElement('plumigo-badges')
export class PlumigoBadges extends LitElement {
  @property({ type: Array }) achievements: Achievement[] = [];
  @property({ type: Array }) unlockedIds: string[] = [];

  static styles = css`
    :host {
      display: block;
    }

    h2 {
      font-size: 1.2rem;
      margin: 0 0 1rem;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 0.75rem;
    }

    .card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      padding: 1rem 0.5rem;
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: var(--radius);
      text-align: center;
      transition: border-color 0.2s;
    }

    .card.unlocked {
      border-color: var(--accent);
    }

    .card.locked {
      opacity: 0.5;
    }

    .icon {
      font-size: 2rem;
    }

    .name {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text);
    }

    .desc {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
  `;

  render() {
    const unlocked = new Set(this.unlockedIds);

    return html`
      <h2>🏅 Mes badges</h2>
      <div class="grid">
        ${this.achievements.map((ach) => {
          const isUnlocked = unlocked.has(ach.id);
          return html`
            <div class="card ${isUnlocked ? 'unlocked' : 'locked'}">
              <span class="icon">${isUnlocked ? ach.icon : '🔒'}</span>
              <span class="name">${ach.name}</span>
              <span class="desc">${isUnlocked ? ach.description : 'Verrouillé'}</span>
            </div>
          `;
        })}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'plumigo-badges': PlumigoBadges;
  }
}
