import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/color.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-card/paper-card';
import '@polymer/paper-button/paper-button';
import '@polymer/paper-toast';
import { TopicService } from '../services/topics-service';
/**
 * `add-topic` Description
 *
 * @customElement
 * @polymer
 * @demo
 * 
 */
class AddTopic extends PolymerElement {
    static get properties() {
        return {
            title: {
                type: String,
                reflectToAttribute: true
            },
            text:
            {type: String,
            reflectToAttribute: true
            },
            _userMessage: String,
        }
    }

    static get template() {
        return html`
        <style>
            :host {
                display: flex;
                flex-flow: column;
                margin: 10px;
                align-items: center;
                justify-content: center;
               
            
            }

            paper-card {
                width: 70%;
            }

            .card-title {
                @apply( --paper-font-headline);
              
            
            }
            .card-title{
                border-bottom: 1px solid lightgray;
                padding-bottom: 10px;
                margin-bottom: 5px;
                text-align: center;
            }
           
             paper-button{
                width: 90%;
                margin-top: 30px;
                margin-bottom: 30px;
                float: right;
            }
            paper-button.purple{
                background-color: var( --paper-deep-purple-800);
                color: white;
                
                width: 120px;
            }
            paper-textarea{
                 width: 90%;
                margin-top: 30px;
                
            }
            paper-input{
                width: 90%;
            }
            h2 { 
                @apply --paper-font-title
                }
            paper-button.purple:hover{
                background-color: var( --paper-deep-purple-700);
            }
           
            .userMessage{
                background-color:darkslategray ;
                
                color: white;
                width: 75%;
                height: 50px;
                margin-top: 10px;
                margin-bottom: 10px;
                text-align: center;
                align-content: center;
                
            }
            .userMessage > p { 
                @apply --paper-font-common-base;
                font-size: 16px;
               
                }
           
</style>

    <paper-card>
        <div class="card-content">
            <div class="card-title">Add Topic</div>
       <paper-input value={{title}} label="Title"></paper-input>
       <paper-textarea  label="Content" rows="1"   value={{text}} max-rows="10"></paper-textarea>
        <paper-button raised on-tap="_submitTopic" class="purple">Submit</paper-button>
            </div>
            </paper-card>
         <div id="messageEl" class="userMessage" hidden="hidden">
             <p>[[_userMessage]]</p></div>
        `;
    }

    /**
     * Instance of the element is created/upgraded. Use: initializing state,
     * set up event listeners, create shadow dom.
     * @constructor
     */
    constructor() {
        super();
        this.topicService = new TopicService();
    }

    /**
     * Use for one-time configuration of your component after local
     * DOM is initialized.
     */
    ready() {
        super.ready();
    }

    _submitTopic(){
        const topic = {
            title: this.title,
            text: this.text
        };
        this.topicService.postTopic(topic)
            .then( response => {
                console.log(response);
            });

    }
}

customElements.define('add-topic', AddTopic);