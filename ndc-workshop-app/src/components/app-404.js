import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/**
 * `app-404` Description
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class App404 extends PolymerElement {
    static get properties() {
        return {

        }
    }

    static get template() {
        return html`
            <style>
                :host {
                display: block;
                padding: 10px;
                }
            </style>
            <div class="card">
                <h1>404</h1>
                <p>Sorry, we can't find the page you're looking for. Please check the URL and try again.</p>
            </div>
        `;
    }

    /**
     * Instance of the element is created/upgraded. Use: initializing state,
     * set up event listeners, create shadow dom.
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Use for one-time configuration of your component after local
     * DOM is initialized.
     */
    ready() {
        super.ready();
    }
}

customElements.define('app-404', App404);