import '@polymer/paper-button/paper-button';
import {LitElement, html, CSSResultArray, css} from 'lit-element';

export type ToastOptions = {
  text: string;
  hideCloseBtn: boolean;
  duration?: number;
};

export class EtoolsToast extends LitElement {
  public toastOptions!: ToastOptions;
  public defaultDuration = 30000;

  render() {
    return html`
      <span id="label">${this.toastOptions?.text}</span>
      ${this.toastOptions?.hideCloseBtn
        ? ''
        : html`<paper-button @click="${() => this.closeToast()}">Ok</paper-button>`}
    `;
  }

  public connectedCallback(): void {
    super.connectedCallback();

    if (this.isMultiLine()) {
      this.classList.add('toast-multi-line');
    }

    setTimeout(() => this.closeToast(), this.toastOptions?.duration || this.defaultDuration);
  }

  public closeToast() {
    this.animate(
      [
        {transform: 'translateX(0)', opacity: 1},
        {transform: 'translateX(-120%)', opacity: 0}
      ],
      {duration: 300, easing: 'ease-in'}
    ).onfinish = () => {
      this.dispatchEvent(
        new CustomEvent('toast-closed', {
          composed: true,
          detail: this
        })
      );
      this.classList.add('hidden');
    };
  }

  private isMultiLine() {
    const text = this.toastOptions?.text;
    if (!text) {
      return false;
    }
    return text.length > 80 || text.includes('\n');
  }

  static get styles(): CSSResultArray {
    // language=css
    return [
      css`
        :host {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          max-width: 568px;
          min-height: 40px;
          background-color: var(--paper-toast-background-color, #323232);
          color: var(--paper-toast-color, #f1f1f1);
          min-width: 288px;
          padding: 16px 24px;
          box-sizing: border-box;
          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
          border-radius: 2px;
          margin: 12px;
          font-size: 14px;
          cursor: default;
          animation: show 0.3s;
          white-space: pre-wrap;
        }
        :host(.toast-multi-line) {
          flex-direction: column;
          text-align: justify;
          align-items: flex-start;
        }
        :host(.hidden) {
          opacity: 0;
        }
        paper-button {
          text-transform: uppercase;
          color: var(--primary-color);
          padding: 8px;
          min-width: 16px;
          margin: 0 -8px 0 24px;
        }
        :host(.toast-multi-line) paper-button {
          margin: 0 -8px -8px 0;
          align-self: flex-end;
        }
        @keyframes show {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0px);
            opacity: 1;
          }
        }
      `
    ];
  }
}

window.customElements.define('etools-toast', EtoolsToast);
