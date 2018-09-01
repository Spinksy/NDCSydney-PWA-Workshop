import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-styles/color.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-button/paper-button';
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
                justify-content: space-between;
            }
             paper-button{
                width: 90%;
                margin-top: 30px;
                margin-bottom: 30px;
            }
            paper-button.purple{
                background-color: var( --paper-deep-purple-800);
                color: white;
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
<h2>Add topic</h2>
     
       <paper-input value={{title}} label="Title"></paper-input>
       <paper-textarea  label="Content" rows="1"   value={{text}} max-rows="10"></paper-textarea>

    
        <paper-button raised on-tap="_submitTopic" class="purple">Submit</paper-button>
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
    }

    /**
     * Use for one-time configuration of your component after local
     * DOM is initialized.
     */
    ready() {
        super.ready();
    }
}

customElements.define('add-topic', AddTopic);