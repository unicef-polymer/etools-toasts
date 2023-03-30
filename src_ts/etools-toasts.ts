import {LitElement, html, CSSResultArray, css} from 'lit-element';
import {EtoolsToast, ToastOptions} from './etools-toast';
import {repeat} from 'lit-html/directives/repeat';
import './etools-toast';

const MAX_TOAST_SHOWN = 3;

export class EtoolsToasts extends LitElement {
  private toastQueue: ToastOptions[] = [];

  protected render() {
    return repeat(
      this.toastQueue.slice(0, MAX_TOAST_SHOWN),
      (toastOptions: ToastOptions) => toastOptions.text,
      (toastOptions: ToastOptions) =>
        html`<etools-toast
          .toastOptions="${toastOptions}"
          @toast-closed="${(e: CustomEvent<EtoolsToast>) => this.showNext(e)}"
        ></etools-toast>`
    );
  }

  public connectedCallback() {
    super.connectedCallback();
    // @ts-ignore
    document.body.addEventListener('toast', (event: CustomEvent<ToastOptions>) => this.queueToast(event));
    document.body.addEventListener('close-toasts', () => this.closeAllToasts());
  }

  closeAllToasts() {
    this.shadowRoot?.querySelectorAll<EtoolsToast>('etools-toast').forEach((t: EtoolsToast) => t.closeToast());
    this.toastQueue = [];
  }

  public queueToast({detail}: CustomEvent<ToastOptions>) {
    const alreadyInQueue: boolean = this.toastQueue.some(
      (toastDetails) => JSON.stringify(toastDetails) === JSON.stringify(detail)
    );
    if (alreadyInQueue) {
      return;
    }

    this.toastQueue.push(detail);
    this.requestUpdate();
  }

  public showNext(event: CustomEvent<EtoolsToast>) {
    const toastElement: EtoolsToast = event.detail;
    const index = this.toastQueue.indexOf(toastElement.toastOptions);
    this.toastQueue.splice(index, 1);
    toastElement.remove();
    this.requestUpdate();
  }

  static get styles(): CSSResultArray {
    // language=css
    return [
      css`
        :host {
          position: fixed;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 10px;
          bottom: 0;
          inset-inline-start: 0;
          z-index: 104;
        }
      `
    ];
  }
}

customElements.define('etools-toasts', EtoolsToasts);
