using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NDC.Workshop.Server.Models;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using WebPush;

namespace NDC.Workshop.Server.Controllers
{

    [ApiController]
    public class PushNotificationSubscriptionsController : ControllerBase
    {
        private VapidSettings _vapidSettings;

        public PushNotificationSubscriptionsController(IOptions<VapidSettings> vapidSettings)
        {
            _vapidSettings = vapidSettings.Value;
        }

        [HttpPost("api/[controller]")]
        public async Task<IActionResult> Create([FromBody] PushNotificationSubscription subscription)
        {
            var pushSub = new PushSubscription(subscription.Endpoint, subscription.Key, subscription.AuthSecret);
            var vapidDetails = new VapidDetails(_vapidSettings.Subject, _vapidSettings.PublicKey,
                _vapidSettings.PrivateKey);

            var webPushClient = new WebPushClient();
           

            //todo: store subscription

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
                return new StatusCodeResult((int) statusCode);
            }

            return new OkResult();
        }

        private string GetIconUrl(HttpRequest request, string relativeAssetPath)
        {
            var scheme = request.Scheme;
            var host = request.Host;

            return $"{scheme}://{host}/{relativeAssetPath}";
        }
    }
}
