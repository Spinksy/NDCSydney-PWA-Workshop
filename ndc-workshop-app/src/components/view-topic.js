import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {TopicService} from '../services/topics-service';
import './index';
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
            id:{
                type: String,
                observer:'_idChanged'
            
            },
            topic: {
                type: Object
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
            padding: 0;
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
        
    }

    _idChanged(id){
        console.log("Id changed");
        const service = new TopicService();
        service.getTopicById(id)
        .then (data =>{
        this.topic = data;
        }) 
        .catch(err => {
           this.topic = {title: "Topic currently unavailable", text: "you may be offline"};
        });

    }
    _formatDate(value){
        return moment(value, moment.ISO_8601).format("DD/MM/YYYY");
    }
}

customElements.define('view-topic', ViewTopic);