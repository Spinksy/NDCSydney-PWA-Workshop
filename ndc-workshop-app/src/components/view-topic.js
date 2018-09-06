import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/**
 * `view-topic` Description
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class ViewTopic extends PolymerElement {
    static get properties() {
        return {
            topicId:{
                type: String
            },
            topic: {
                type: Object,
                value: {title:"This is a title", content:"thisidd ismemcontent /n with a line break", date:"12/09/2018"}
            }
        }
    }

    static get template() {
        return html`
            <h1>[[topic.title]] - <sub>[[topic.date]]</h1>
            <hr/>
            <p>[[topic.content]]</p>
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

customElements.define('view-topic', ViewTopic);