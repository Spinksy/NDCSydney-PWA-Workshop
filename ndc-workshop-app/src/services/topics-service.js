export class TopicService {

     
    getTopics() {
        const baseUrl = window.location.origin;
    const apiEndpoint = `${baseUrl}/api/topics`;
        return fetch(apiEndpoint)
            .then(response => {
                if(!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            });
    }
}