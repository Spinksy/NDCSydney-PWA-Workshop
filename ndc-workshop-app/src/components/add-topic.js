import { PolymerElement, html } from "@polymer/polymer/polymer-element";
import './index';
import { TopicService } from "../services/topics-service";
// add import state for store

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
      text: {
        type: String,
        reflectToAttribute: true
      },
      _userMessage: String
    };
  }

  static get template() {
    return html`
        <custom-style>
        <style is="custom-style">
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
           
        .save-toast{
            --paper-toast-background-color: var(--paper-green-700) ;
        }
        .save-toast-pending {
            --paper-toast-background-color: var(--paper-amber-700)
        }
        .save-toast-failed {
          --paper-toast-background-color: var(--paper-red-700)
        }

        @media only screen and (max-width: 600px){
          paper-card {
                width: 95%;
            }
        }
           
</style>
</custom-style>

    <paper-card >
        <div class="card-content" id="addCard">
            <div class="card-title">Add Topic</div>
       <paper-input value={{title}} label="Title"></paper-input>
       <paper-textarea  label="Content" rows="1"   value={{text}} max-rows="10"></paper-textarea>
        <paper-button raised on-tap="_submitTopic" class="purple">Submit</paper-button>
        </div>
        </paper-card>
        <paper-toast raised id="saveToast" >[[_userMessage]]</paper-toast>
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
    //add creation of Store.
    
  }

  /**
   * Use for one-time configuration of your component after local
   * DOM is initialized.
   */
  ready() {
    super.ready();
  }

  _submitTopic() {
    const topic = {
      title: this.title,
      text: this.text
    };
    this.topicService
      .postTopic(topic)
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          this._userMessage = `topic "${this.title}" saved`;
          this._setToast('success');
          this.title = '';
          this.text = '';
        } else {
          // add logic to save topic to IndexedDB
          this._setToast('failed');
          this._userMessage = 'failed to save topic';
        }
        this.$.saveToast.open();
      })
      .catch(error => {
        //also add logic to save topic to IndexedDB
        this._setToast('failed');
        this._userMessage = 'failed to save topic';
        this.$.saveToast.open();
      });
  }

  _setToast(status) {
    this.$.saveToast.classList.add('fit-bottom');
    switch (status) {
      case 'success':
        this.$.saveToast.classList.add('save-toast');
        break;
      case 'pending':
        this.$.saveToast.classList.add('save-toast-pending');
        break;
      case 'failed':
       this.$.saveToast.classList.add('save-toast-failed');
    }
  }

 
}

customElements.define('add-topic', AddTopic);
