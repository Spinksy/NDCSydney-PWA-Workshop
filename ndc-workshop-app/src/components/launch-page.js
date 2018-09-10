import { PolymerElement, html } from "@polymer/polymer/polymer-element";

import { PushNotificationService } from "../services/push-notification-service";  
import './index';

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
      subscriberButtonText: {
        type: String,
        value: "Register for notifications"
      },
      isSubscribed: {
        type: Boolean,
        value: false,
        observer: "_subscriptionChanged"
      }
    };
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

            paper-button {
                margin-top: 30px;
                margin-bottom: 30px;
                width: 49%;
            }
           a  paper-button{
                width: 70%;
            }


            paper-button.purple{
                background-color: var( --paper-deep-purple-800);
                color: white;
            }

            paper-button.purple:hover{
                background-color: var( --paper-deep-purple-700);
            }

            @media only screen and (max-width: 600px){
                a {
                    width: 90%;
                }
                a  paper-button {
                width: 90%;
                }
                paper-button {
                 width: 80%;
                }
            }

        </style>
        <a href="[[rootPath]]add" class="button">
        <paper-button raised class="purple" data-args="add" >Add New Topic</paper-button>
        </a>
        <a href="[[rootPath]]list" class="button">
        <paper-button raised class="purple" data-args="list">View Topics</paper-button>
        </a>
        <paper-button raised class="purple" on-click="_subscribeForNotifications">[[subscriberButtonText]]</paper-button>
        `;
  }

  /**
   * Instance of the element is created/upgraded. Use: initializing state,
   * set up event listeners, create shadow dom.
   * @constructor
   */
  constructor() {
    super();
    this.subscriptionService = new PushNotificationService();
  }
  /**
   * Use for one-time configuration of your component after local DOM is
   * initialized.
   */
  ready() {
    super.ready();
    this.subscriptionService = new PushNotificationService();
    this.isSubscribed = this.subscriptionService.isSubscribed;
  }

  _subscribeForNotifications() {
    if (this.subscriptionService.isSubscribed) {
      this.subscriptionService.unsubscribeFromNotification().then(r => {
        this.isSubscribed = this.subscriptionService.isSubscribed;
      });
    } else {
      this.subscriptionService.subscribeToPushNotifications().then(r => {
        this.isSubscribed = this.subscriptionService.isSubscribed;
      });
    }
  }

  _subscriptionChanged() {
    if (this.subscriptionService.isSubscribed) {
      this.subscriberButtonText = "Unsubscribe from notifications";
    } else {
      this.subscriberButtonText = "Subscribe to notifications";
    }
  }
}
customElements.define("launch-page", LaunchPage);
