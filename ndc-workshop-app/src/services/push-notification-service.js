import {PushNotificationModel} from './push-notification-model';
export class PushNotificationService{
    
    constructor(){
        this.isPushSupported =  'serviceWorker' in navigator && 'PushManager' in window;
        this.vapidPublicKey = 'BOTBHC3-eum90kAPRO186pK_KG29BCId9M5lbZxzbDvykYD4DfDpAxKO4tBWbXCY7ffvaKjui81h6Q5wEM4vBL4';
        this.subscriptionEndpoint =`${window.location.origin}/api/PushNotificationSubscriptions`;
    }

    subscribeToPushNotifications() {
      
        if (!this.isPushSupported){
            console.log('This browser does not support push notifications');
            return;
        }

        navigator.serviceWorker.ready
            .then(swRegistration => {
                swRegistration.pushManager.getSubscription()
                    .then(subscription => {
                        if (subscription){
                            //subscription present thus no need to register
                            return;
                        }
                        return swRegistration.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: this._urlBase64ToUint8Array(this.vapidPublicKey)
                    })
                    .then(subscription => {
                        const rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
                        const key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
                        const rawAuthSecret = subscription.getKey ? subscription.getKey('auth'): '';
                        const authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';
                        const endpoint = subscription.endpoint;

                        const pushSubscription = new PushNotificationModel(key, endpoint, authSecret);

                        const fetchOptions = {
                          method: 'POST',
                          headers: new Headers({
                            'Content-Type': 'application/json'
                        }),
                          body: JSON.stringify(pushSubscription)   
                        };

                        fetch(this.subscriptionEndpoint, fetchOptions)
                            .then(response =>{
                                if(response.ok){
                                    console.log('push notification registration created');
                                }else{
                                    console.log("we hit a problem");
                                }
                            });
                    });
                });
           
            });
    }

    unsubscribeFromNotification(){
        navigator.serviceWorker.ready.then(reg =>{
            reg.pushManager.getSubscription()
                .then( subscription =>{
                    if(!subscription){
                        return;
                    }
                    subscription.unsubscribe()
                        .then(successful =>{
                            console.log("you have unsubscribed from notifications")
                        })
                        .catch(error =>{
                            console.log("unsubscription failed");
                        });
                });
        });
    }

    _urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

}