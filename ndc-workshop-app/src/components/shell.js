import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import {
  setRootPath,
  setPassiveTouchGestures
} from "@polymer/polymer/lib/utils/settings.js";
import "@polymer/app-layout/app-header-layout/app-header-layout.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/app-layout/app-header/app-header.js";
import "@polymer/app-route/app-route.js";
import "@polymer/app-route/app-location.js";
import "@polymer/iron-pages/iron-pages.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-icon-button/paper-icon-button.js";

setPassiveTouchGestures(true);
setRootPath(AppGlobals.rootPath);

/**
 * `app-shell` shell for application
 *
 * @customElement
 * @polymer
 * @demo
 *
 */
class Shell extends PolymerElement {
  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: "_pageChanged"
      },
      previousPage: {
        type: String
      },
      refreshData: {
        type: Boolean,
        value: false
      },
      routeData: Object,
      subroute: Object,
      route: Object
     
    };
  }

  static get observers() {
    return ["_routePageChanged(routeData.page)"];
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
          display: block;
        }
        body{
          margin: 0;
          background-color: #E2E2E2;
      }
      app-toolbar {
    background-color: #1E88E5;
    font-family: 'Roboto', Helvetica, sans-serif;
    color: white;
    --app-toolbar-font-size: 24px;
    width:100%;
  }
#title {
width: 100%;
text-align: center;
  }

  .subscription-toggle {
    margin-right: 0.5rem;
  }

</style>
      <app-location route="{{route}}" url-space-regex="^[[rootPath]]"></app-location>
      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>
     <app-header-layout>
     <app-header fixed slot="header">
        <app-toolbar id="header">
          <paper-icon-button icon="arrow-back"
          on-click="_goBack"
          title="back"
          id="backButton"
          ></paper-icon-button>
          <div id="title" maintitle>NDC PWA Workshop App</div>
</div>
        </app-toolbar>
      </app-header>
      <iron-pages role="main"
          selected="[[page]]"
          attr-for-selected="name"
          selected-attribute="visible">
            <launch-page name="launch" on-selected="_onSelected"></launch-page>
            <list-topics id="list" name="list" refresh="[[refreshData]]" on-loaded="_onLoadCompleted"></list-topics>
            <add-topic name="add"></add-topic>
            <app-404 name="404"></app-404>
            <view-topic name="view" id="{{route.__queryParams.id}}"></view-topic>
        </iron-pages>
        </app-header-layout>

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

  _routePageChanged(page) {
    if (!page) {
      this.page = "launch";
      this.set('route.path', '/');
    } else if (["launch", "list","add","view"].indexOf(page) !== -1) {
      this.page = page;
    } else{
      this.page = "404";
    }
  }

  _pageChanged(page, oldPage) {
    console.log(this.subroute);
    if(oldPage !== undefined){
      this.previousPage = oldPage;
  }
    switch (page) {
      case "launch":
        import(/* webpackChunkName: "launch-page" */ "./launch-page");
        this.set('route.path', '/');
        break;
      case "list":
        this.refreshData = true;
        import(/* webpackChunkName: "list-topics" */ "./list-topics");
        break;
      case "add":
        import(/* webpackChunkName: "add-topic" */ "./add-topic");
        break;
      case "404":
        import(/* webpackChunkName: "app-404" */ "./app-404");
        break;
      case "view":
        import(/* webpackChunkName: "view-topic" */ "./view-topic");
        break;

    }
    this._disableBackButton();
  }

  _disableBackButton(){
    if (this.page === 'launch' || this.page === 'app404'|| this.page === undefined){
        this.$.backButton.disabled = true;
    }else{
        this.$.backButton.disabled = false;
    }
 }
 _goBack(){
         if(this.previousPage !== undefined){
             this.page = this.previousPage;
         }else{
           this.page = "launch";
         }
    }

  _onSelected(e) {
    e.cancelBubble = true;
    let action = e.detail.action;
    this.page = action;
  }
  _onLoadCompleted(e) {
    e.cancelBubble = true;
    this.refreshData = false;
  }
}

customElements.define("app-shell", Shell);
