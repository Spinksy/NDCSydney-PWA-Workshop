import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/color.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/paper-spinner/paper-spinner.js';
/**
 * `list-topics` Description
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class ListTopics extends PolymerElement {
    static get properties() {
        return {
            topics:{
                type: Array
            },
             refresh: {
                 type: Boolean,
                 value: false,
                 observer: "_reloadData"
             },
             _loadCompleted:{
                 type: Boolean,
                 value: false
             },
             _noTopics: {
                 type: Boolean,
                 value: true
             }
        }
    }

    static get template() {
        return html`
 <style>
            :host {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;

            }
            paper-card {
               margin-bottom: 10px;
               margin-right: 5px;
               margin-left: 5px;
               margin-top: 5px;
              width: 90%;
               padding-top: 3px;
            }

            .topic-header { @apply --paper-font-headline;
                border-bottom: 1px gray solid;
             
             }

            .topic {
        flex: 1;
        padding-left: 1rem;
      }
      .topic-text{
          max-height: 250px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow-wrap: break-word;
          overflow: hidden;
          margin-top: 10px;
      }
      .date{
          font-size: 0.7em;
          text-align: right;
          margin-right: 5px;
          margin-top: 10px;
      }
      .card-content{
          padding: 8px;
      }
    paper-spinner{
        margin-top: 200px;
    }
        </style>
        <template is="dom-if" if="[[_noTopics]]">
                <paper-card>
                        <div class="card-content">
                            <div class="topic-header">
                             Oops!
                            </div>
                        <div class="topic-text">
                           No topics could be retrieved or are available.
                             </div>
                        </div>
                    </paper-card>  
        </template>
            <template is="dom-repeat" items=[[topics]] initial-count="10">
                <paper-card>
                    <div class="card-content">
                        <div class="topic-header">
                            [[item.title]]
                        </div>
                    <div class="topic-text">
                         [[item.text]]
                         </div>
                     <div class="date">
                        [[formatDate(item.date)]]
                    </div>
                    </div>
                </paper-card>
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

    __getList(){
        this._loadCompleted = false;
        this._noTopics = false;
        const baseUrl = window.location.origin;
        const apiEndpoint = `${baseUrl}/api/topics`;
        return fetch(apiEndpoint,)
            .then(response =>{
                if(response.ok){
                    return response.json()
                    .then(data => {
                        this._loadCompleted = true;
                        this.topics =  data;
                    });
                }
                else{
                    console.error(`${response.status}: ${response.statusText}`);
                    this._loadCompleted = true;
                    this._noTopics = true;
                }

            })
            .catch(err => {
                console.error(err);
                this._loadCompleted = true;
                this._noTopics = true;
            });
    }

        _reloadData(){
            if (this.refresh){
                this.__getList()
                    .then(e =>{
                        console.log("Data refreshed");
                        let newEvent = new CustomEvent('loaded',{ bubbles:true, composed: true});
                        this.dispatchEvent(newEvent);
                    });
            }
        }

}

customElements.define('list-topics', ListTopics);