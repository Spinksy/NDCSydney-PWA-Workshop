export class TopicService {

    constructor(){
        this.baseUrl =  'https://timeghostpwa.azurewebsites.net';// window.location.origin;
        this.apiEndpoint = `${this.baseUrl}/api/topics`
    }
     
    getTopics() {
     
        return fetch(this.apiEndpoint)
            .then(response => {
                if(!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            });
    }
    postTopic(topic){
        if (!topic){
            return Promise.resolve();
        }

        const options = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(topic)
        };

        return fetch(this.apiEndpoint, options);

    }

    getTopicById(id){
        if (!id){
            return Promise.resolve();
        }
            return fetch(`${this.apiEndpoint}/${id}`)
            .then(response => {
                if(!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            });
        
    }
}