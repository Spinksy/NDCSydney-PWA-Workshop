using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NDC.Workshop.Server.Models;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using NDC.Workshop.Server.Configuration;
using WebPush;

namespace NDC.Workshop.Server.Controllers
{

    [ApiController]
    public class PushNotificationSubscriptionsController : ControllerBase
    {
        private readonly DocumentClient _client;
        private VapidSettings _vapidSettings;
        private CosmosDbConfiguration _cosmosConfig;

        public PushNotificationSubscriptionsController(IOptions<VapidSettings> vapidSettings, IOptions<CosmosDbConfiguration> cosmosDBConfig, DocumentClient client)
        {
            _client = client;
            _vapidSettings = vapidSettings.Value;
            _cosmosConfig = cosmosDBConfig.Value;
        }

        [HttpPost("api/[controller]")]
        public async Task<IActionResult> Create([FromBody] PushNotificationSubscription subscription)
        {
            var pushSub = new PushSubscription(subscription.Endpoint, subscription.Key, subscription.AuthSecret);
            var vapidDetails = new VapidDetails(_vapidSettings.Subject, _vapidSettings.PublicKey,
                _vapidSettings.PrivateKey);

            var webPushClient = new WebPushClient();


            await SavePushSubscription(pushSub);
            var payload = new PushNotificationPayload
            {
                Msg = "Thank you for subscribing",
                Icon = GetIconUrl(Request, @"assets/favicon-32x32.png")
            };

            try
            {
                webPushClient.SetVapidDetails(vapidDetails);
                await webPushClient.SendNotificationAsync(pushSub, JsonConvert.SerializeObject(payload), vapidDetails);
            }
            catch (WebPushException wpe)
            {
                var statusCode = wpe.StatusCode;
                return new StatusCodeResult((int)statusCode);
            }

            return new OkResult();
        }

        private async Task SavePushSubscription(PushSubscription pushSub)
        {
            var uri = UriFactory.CreateDocumentCollectionUri(_cosmosConfig.DefaultDb,
                _cosmosConfig.SubscribersCollection);

            await _client.CreateDocumentAsync(uri, pushSub);
        }

        private string GetIconUrl(HttpRequest request, string relativeAssetPath)
        {
            var scheme = request.Scheme;
            var host = request.Host;

            return $"{scheme}://{host}/{relativeAssetPath}";
        }
    }
}
