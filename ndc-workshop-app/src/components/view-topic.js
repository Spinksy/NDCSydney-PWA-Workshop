import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {TopicService} from '../services/topics-service';
import '@polymer/paper-styles/paper-styles';
import moment from 'moment/moment';

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
        <style>
            
            :host {
               @apply --layout-vertical;
                background-color: var(--light-theme-background-color);
                --default-padding: 0.5rem;
                padding-left: var(--default-padding);
                padding-right: var(--default-padding);
                padding-bottom: var(--default-padding);
            }
           
           .header {
               border-bottom: 1px solid var(--light-theme-divider-color);
           }
           .content-body {
            overflow-y: auto;
            white-space: pre-wrap;
           }

        </style>
            <div class="header">
            <h3>[[topic.title]] </h3>
        </div>
         <div class="content-body">
            [[topic.text]]
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
        const service = new TopicService();
        service.getTopicById('c4b9265a-4a2b-48a5-893a-d7da950b214f')
        .then (data =>{
        this.topic = data;
        }) 
  .catch(err => {
    console.error(err);
  });

    }
    _formatDate(value){
        return moment(value, moment.ISO_8601).format("DD/MM/YYYY");
    }
}

customElements.define('view-topic', ViewTopic);