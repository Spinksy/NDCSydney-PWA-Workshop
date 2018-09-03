import {PolymerElement, html} from '@polymer/polymer/polymer-element';
import '@polymer/paper-styles/color';
import '@polymer/paper-styles/typography';
import '@polymer/paper-button/paper-button';


/**
 * `launch-page` Description
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class LaunchPage extends PolymerElement {
    static get properties() {
        return {

        }
    }

    /**
     * Implement to describe the element's DOM using lit-html.
     * Use the element current props to return a lit-html template result
     * to render into the element.
     */
    static get template() {
        return html`
            <style>
            :host {
                display: flex;
                flex-flow: column;
                margin: 10px;
                align-items: center;
                justify-content: space-between;
                
            }
            a {
                width: 70%;
                text-align: center;
            }
            paper-button{
                width: 70%;
                margin-top: 30px;
                margin-bottom: 30px;
            }
            paper-button.purple{
                background-color: var( --paper-deep-purple-800);
                color: white;
            }

            paper-button.purple:hover{
                background-color: var( --paper-deep-purple-700);
            }

        </style>
        <a href="[[rootPath]]add" class="button">
        <paper-button raised class="purple" data-args="add" >Add New Topic</paper-button>
        </a>
        <a href="[[rootPath]]list" class="button">
        <paper-button raised class="purple" data-args="list">View Topics</paper-button>
        </a>
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

}

customElements.define('launch-page', LaunchPage);