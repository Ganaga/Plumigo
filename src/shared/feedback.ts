import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import type { GrammarError } from '../modules/writing/grammar-checker';
import { renderMascot, getMascotSpeech, type MascotPose } from './mascot';

const ENCOURAGEMENTS = [
  'Zéro faute, bravo ! Continue comme ça !',
  'Parfait ! Ton texte est impeccable !',
  'Aucune erreur, tu es un champion !',
  'Super travail ! Pas une seule faute !',
  'Excellent, ton écriture est parfaite !',
];

@customElement('plumigo-feedback')
export class PlumigoFeedback extends LitElement {
  @property({ type: Array }) errors: GrammarError[] = [];
  @property({ type: String }) text = '';
  @property({ type: Number }) cursorPos = 0;

  static styles = css`
    :host {
      display: block;
    }

    .feedback {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 1rem;
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: var(--radius);
      margin-bottom: 1rem;
      min-height: 64px;
      transition: border-color 0.3s, background 0.3s;
    }

    .feedback.ok {
      border-color: var(--secondary);
      background: rgba(0, 184, 148, 0.05);
    }

    .feedback.error {
      border-color: var(--warning);
      background: rgba(255, 165, 2, 0.05);
    }

    .msg {
      flex: 1;
      font-size: 0.95rem;
      line-height: 1.4;
    }

    .msg-ok {
      color: var(--secondary);
      font-weight: 600;
    }

    .msg-error {
      color: var(--text);
    }
  `;

  private getClosestError(): GrammarError | null {
    if (this.errors.length === 0) return null;
    if (this.errors.length === 1) return this.errors[0]!;

    let closest = this.errors[0]!;
    let closestDist = Infinity;
    for (const err of this.errors) {
      const dist = Math.min(
        Math.abs(err.offset - this.cursorPos),
        Math.abs(err.offset + err.length - this.cursorPos),
      );
      if (dist < closestDist) {
        closestDist = dist;
        closest = err;
      }
    }
    return closest;
  }

  render() {
    let pose: MascotPose = 'happy';
    let msg = getMascotSpeech('happy');
    let cls = '';
    let msgCls = '';

    if (this.errors.length === 0) {
      if (this.text.trim().length > 10) {
        pose = 'ecstatic';
        msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]!;
        cls = 'ok';
        msgCls = 'msg-ok';
      } else if (this.text.trim().length > 0) {
        msg = 'Continue d\'écrire, tu te débrouilles bien !';
      }
    } else {
      pose = 'unhappy';
      cls = 'error';
      msgCls = 'msg-error';
      const closest = this.getClosestError()!;
      const errorWord = this.text.slice(closest.offset, closest.offset + closest.length);

      if (closest.isGrammar) {
        msg = closest.shortMessage
          ? `${closest.shortMessage} : « ${errorWord} » — ${closest.message}`
          : `Attention : « ${errorWord} » — ${closest.message}`;
      } else {
        msg = closest.replacements.length > 0
          ? `Attention, « ${errorWord} » semble mal écrit ! Essaie « ${closest.replacements[0]} »`
          : `Attention, vérifie le mot « ${errorWord} »`;
      }
    }

    return html`
      <div class="feedback ${cls}">
        ${unsafeHTML(renderMascot(pose, 48))}
        <span class="msg ${msgCls}">${msg}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'plumigo-feedback': PlumigoFeedback;
  }
}
