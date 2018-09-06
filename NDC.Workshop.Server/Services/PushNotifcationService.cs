using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Extensions.Options;
using NDC.Workshop.Server.Configuration;
using NDC.Workshop.Server.Models;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Ocsp;
using WebPush;

namespace NDC.Workshop.Server.Services
{
    public class PushNotifcationService : IPushNotifcationService
    {
        private readonly DocumentClient _client;
        private readonly VapidSettings _vapidSettings;
        private WebPushClient _pushClient;
        private CosmosDbConfiguration _cosmosConfig;

        public PushNotifcationService(IOptions<VapidSettings> vapidSettings, IOptions<CosmosDbConfiguration> cosmosDbOptions, DocumentClient client)
        {
            _client = client;
            _vapidSettings = vapidSettings.Value;
            _pushClient = new WebPushClient();
            _cosmosConfig = cosmosDbOptions.Value;

            _pushClient.SetVapidDetails(_vapidSettings.Subject, _vapidSettings.PublicKey, _vapidSettings.PrivateKey);
        }


        public async Task SendNotificationToSubscribers(string message, string baseUrl)
        {
            var notificationPayload = new PushNotificationPayload
            {
                Msg = message,
                Icon = GetIconUrl(baseUrl)
            };

            var payloadJson = JsonConvert.SerializeObject(notificationPayload);

            var subscribers = GetSubscribers();

            foreach (var subscriber in subscribers)
            {
                try
                {
                    await _pushClient.SendNotificationAsync(subscriber, payloadJson);
                }
                catch (WebPushException wpe)
                {
                   //add logging
                }
            }
        }

        public async Task<(bool, int)> AddNewSubscriber(PushNotificationSubscription newSubscription, string baseUrl)
        {
            var pushSub = new PushSubscription(newSubscription.Endpoint, newSubscription.Key, newSubscription.AuthSecret);


            await SavePushSubscription(pushSub);

            var payload = new PushNotificationPayload
            {
                Msg = "Thank you for subscribing",
                Icon = GetIconUrl(baseUrl)
            };

            try
            {
                await _pushClient.SendNotificationAsync(pushSub, JsonConvert.SerializeObject(payload));

                return (true, 200);
            }
            catch (WebPushException wpe)
            {
                return (false, (int) wpe.StatusCode);
            }
        }

        public async Task DeleteSubscription(PushNotificationSubscription subscriptionToDelete)
        {
            var uri = UriFactory.CreateDocumentCollectionUri(_cosmosConfig.DefaultDb,
                _cosmosConfig.SubscribersCollection);

            
                var queryString = $"SELECT * FROM c WHERE c.Endpoint = \"{subscriptionToDelete.Endpoint}\"";
                var currentDoc = _client.CreateDocumentQuery<Document>(uri,
                        queryString,
                        new FeedOptions { MaxItemCount = 1 })
                    .ToList()
                    .FirstOrDefault();
                if (currentDoc != null)
                {
                    await _client.DeleteDocumentAsync(currentDoc.SelfLink);
                }
          
        }

        private List<PushSubscription> GetSubscribers()
        {
            var uri = UriFactory.CreateDocumentCollectionUri(_cosmosConfig.DefaultDb,
                _cosmosConfig.SubscribersCollection);

            var result = _client.CreateDocumentQuery<PushSubscription>(uri).AsEnumerable();

            return result.ToList();
        }

        private async Task SavePushSubscription(PushSubscription pushSub)
        {
            var uri = UriFactory.CreateDocumentCollectionUri(_cosmosConfig.DefaultDb,
                _cosmosConfig.SubscribersCollection);

            await _client.CreateDocumentAsync(uri, pushSub);
        }

        private string GetIconUrl(string baseUrl)
        {
           
            return $"{baseUrl}assets/favicon-32x32.png";
        }
    }
}
