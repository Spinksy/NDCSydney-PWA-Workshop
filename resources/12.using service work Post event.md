```js


//add this function to the sw.js

 function sendAMessage(message){
    self.clients.matchAll().then(clients =>{
        clients.forEach(client => {
            client.postMessage({
                msg: message
              });
        });
      });
}

//add this line to the 'activate event after claiming the clients
  sendAMessage("Service worker is activated");

//To see the messages post from the service worker 
//add the following to the constructor of shell.js

if (window.navigator.serviceWorker){
      window.navigator.serviceWorker.addEventListener('message', event =>{
        this._toastMessage = event.data.msg;
        this.$.infoToast.open();
      })
    }
```