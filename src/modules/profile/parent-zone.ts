import { LitElement, html, css } from 'lit';
import { customElement, state as litState } from 'lit/decorators.js';
import { getState, updateState, getProfiles, getActiveProfileId, createProfile, deleteProfile } from '../../shared/storage';
import { t } from '../../shared/i18n';

function generateMathQuestion(): { question: string; answer: number } {
  const a = Math.floor(Math.random() * 9) + 2;
  const b = Math.floor(Math.random() * 9) + 2;
  return { question: `${a} × ${b}`, answer: a * b };
}

@customElement('plumigo-parent-zone')
export class PlumigoParentZone extends LitElement {
  @litState() private unlocked = false;
  @litState() private mathError = false;
  @litState() private showGate = false;

  private math = generateMathQuestion();

  static styles = css`
    :host { display: block; }

    .gate { margin-top: 2rem; text-align: center; }

    .gate-btn {
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: 2rem;
      padding: 0.6rem 1.5rem;
      font-size: 0.95rem;
      cursor: pointer;
      color: var(--text-muted);
      font-family: inherit;
    }
    .gate-btn:hover { border-color: var(--primary); }

    .math-gate {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }
    .math-gate p { font-size: 1.2rem; margin: 0; color: var(--text); }
    .math-gate input {
      padding: 0.5rem 1rem;
      border: 2px solid var(--border);
      border-radius: var(--radius);
      font-size: 1.1rem;
      width: 100px;
      text-align: center;
      font-family: inherit;
      outline: none;
      background: var(--surface);
      color: var(--text);
    }
    .math-gate input:focus { border-color: var(--primary); }
    .math-error { color: var(--danger); font-size: 0.85rem; }

    .dashboard {
      margin-top: 1.5rem;
      padding: 1.5rem;
      background: var(--surface);
      border-radius: var(--radius);
      border: 2px solid var(--primary-light);
    }
    .dashboard h2 { margin: 0 0 1rem; color: var(--primary); }

    .stat-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border);
      color: var(--text);
    }
    .stat-label { color: var(--text-muted); }
    .stat-value { font-weight: 600; }

    .options { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border); }
    .options h3 { margin: 0 0 0.75rem; font-size: 1rem; color: var(--text); }
    .toggle-row {
      display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;
      padding: 0.6rem 0; cursor: pointer; font-size: 0.9rem; color: var(--text);
    }
    .toggle-row input[type="checkbox"] { width: 20px; height: 20px; accent-color: var(--primary); cursor: pointer; }
    .toggle-hint { width: 100%; font-size: 0.75rem; color: var(--text-muted); }

    .profiles { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border); }
    .profiles h3 { margin: 0 0 0.75rem; font-size: 1rem; color: var(--text); }
    .profiles-list { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0.75rem; }
    .profile-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 0.4rem 0.6rem; background: var(--bg); border-radius: var(--radius); color: var(--text);
    }
    .profile-row em { color: var(--primary); font-size: 0.8rem; }
    .profile-delete { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0.2rem; opacity: 0.6; }
    .profile-delete:hover { opacity: 1; }
    .profile-add { display: flex; gap: 0.5rem; }
    .profile-input {
      flex: 1; padding: 0.4rem 0.7rem; border: 2px solid var(--border); border-radius: var(--radius);
      font-size: 0.9rem; font-family: inherit; outline: none; background: var(--surface); color: var(--text);
    }
    .profile-input:focus { border-color: var(--primary); }
    .add-btn {
      padding: 0.4rem 0.8rem; background: var(--primary); color: white; border: none;
      border-radius: var(--radius); font-family: inherit; font-weight: 600; cursor: pointer;
    }

    .reset-btn {
      margin-top: 1.5rem; background: none; border: 2px solid var(--danger); color: var(--danger);
      border-radius: 2rem; padding: 0.5rem 1.2rem; font-family: inherit; font-size: 0.9rem; cursor: pointer;
    }
    .reset-btn:hover { background: var(--danger); color: white; }
  `;

  private checkAnswer(e: KeyboardEvent) {
    if (e.key !== 'Enter') return;
    const input = e.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (value === this.math.answer) {
      this.unlocked = true;
      this.showGate = false;
    } else {
      this.mathError = true;
      input.value = '';
    }
  }

  private onKeyboardToggle(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    updateState((s) => { s.profile.useBuiltInKeyboard = checked; });
  }

  private onAccentsToggle(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    updateState((s) => { s.dictation.ignoreAccents = checked; });
  }

  private addProfile() {
    const input = this.renderRoot.querySelector('#new-profile-name') as HTMLInputElement;
    const name = input?.value.trim();
    if (name) {
      createProfile(name);
      input.value = '';
      this.requestUpdate();
      this.dispatchEvent(new CustomEvent('profile-changed', { bubbles: true, composed: true }));
    }
  }

  private deleteProfileById(id: string) {
    const profiles = getProfiles();
    const profile = profiles.find((p) => p.id === id);
    if (profile && confirm(`Supprimer le profil "${profile.name}" ? Toutes ses données seront perdues.`)) {
      deleteProfile(id);
      this.requestUpdate();
      this.dispatchEvent(new CustomEvent('profile-changed', { bubbles: true, composed: true }));
    }
  }

  private resetAll() {
    if (confirm(t.profile.resetConfirm)) {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('plumigo_'));
      keys.forEach((k) => localStorage.removeItem(k));
      window.location.reload();
    }
  }

  render() {
    if (!this.unlocked) {
      return html`
        <div class="gate">
          <button class="gate-btn" @click=${() => { this.showGate = true; }}>
            🔒 ${t.profile.parentZone}
          </button>
          ${this.showGate ? html`
            <div class="math-gate">
              <p>${t.profile.parentGate} ${this.math.question} ?</p>
              <input type="number" autocomplete="off" @keydown=${this.checkAnswer} />
              ${this.mathError ? html`<span class="math-error">Mauvaise réponse, réessaie !</span>` : ''}
            </div>
          ` : ''}
        </div>
      `;
    }

    const state = getState();
    const profiles = getProfiles();
    const activeId = getActiveProfileId();
    const totalStories = state.writing.stories.length;
    const totalWords = state.writing.stories.reduce((sum, s) => sum + s.wordCount, 0);
    const activityDays = Object.keys(state.gamification.dailyActivity).sort().reverse().slice(0, 7);

    return html`
      <div class="gate">
        <button class="gate-btn">🔓 Zone parent</button>
      </div>
      <div class="dashboard">
        <h2>📊 Tableau de bord parent</h2>
        <div class="stat-row"><span class="stat-label">Histoires écrites</span><span class="stat-value">${totalStories}</span></div>
        <div class="stat-row"><span class="stat-label">Mots écrits (total)</span><span class="stat-value">${totalWords.toLocaleString('fr-FR')}</span></div>
        <div class="stat-row"><span class="stat-label">Fautes corrigées</span><span class="stat-value">${state.writing.totalCorrections}</span></div>
        <div class="stat-row"><span class="stat-label">Fautes de grammaire corrigées</span><span class="stat-value">${state.writing.grammarCorrections}</span></div>
        <div class="stat-row"><span class="stat-label">Série actuelle</span><span class="stat-value">${state.gamification.dailyStreak} jours</span></div>
        <div class="stat-row"><span class="stat-label">Points totaux</span><span class="stat-value">${state.gamification.totalPoints.toLocaleString('fr-FR')}</span></div>
        <div class="stat-row"><span class="stat-label">Jours actifs (7 derniers jours)</span><span class="stat-value">${activityDays.length}</span></div>

        <div class="options">
          <h3>⚙️ Options</h3>
          <label class="toggle-row">
            <span>Clavier intégré AZERTY</span>
            <span class="toggle-hint">Désactive la correction automatique du clavier Android</span>
            <input type="checkbox" ?checked=${state.profile.useBuiltInKeyboard} @change=${this.onKeyboardToggle} />
          </label>
          <label class="toggle-row">
            <span>Dictée : ignorer les accents et ç</span>
            <span class="toggle-hint">Les erreurs d'accents (é/è/ê, à, ù, ô, ç) ne sont pas comptées en dictée</span>
            <input type="checkbox" ?checked=${state.dictation.ignoreAccents} @change=${this.onAccentsToggle} />
          </label>
        </div>

        <div class="profiles">
          <h3>👥 Gestion des profils</h3>
          <div class="profiles-list">
            ${profiles.map((p) => html`
              <div class="profile-row">
                <span>${p.name} ${p.id === activeId ? html`<em>(actif)</em>` : ''}</span>
                ${profiles.length > 1 ? html`
                  <button class="profile-delete" @click=${() => this.deleteProfileById(p.id)} title="Supprimer">🗑️</button>
                ` : ''}
              </div>
            `)}
          </div>
          <div class="profile-add">
            <input type="text" id="new-profile-name" placeholder="Nom du nouveau profil..." class="profile-input"
                   @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter') this.addProfile(); }} />
            <button class="add-btn" @click=${this.addProfile}>+ Ajouter</button>
          </div>
        </div>

        <button class="reset-btn" @click=${this.resetAll}>${t.profile.reset}</button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'plumigo-parent-zone': PlumigoParentZone;
  }
}
