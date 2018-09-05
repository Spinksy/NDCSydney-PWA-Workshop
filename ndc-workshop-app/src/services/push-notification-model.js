export class PushNotificationModel {
    constructor(key, endpoint, authSecret){
        this.key = key;
        this.endpoint = endpoint;
        this.authSecret = authSecret;
    }
}