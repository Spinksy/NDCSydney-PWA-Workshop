using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NDC.Workshop.Server.Models;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using NDC.Workshop.Server.Configuration;
using NDC.Workshop.Server.Services;
using WebPush;

namespace NDC.Workshop.Server.Controllers
{

    [ApiController]
    public class PushNotificationSubscriptionsController : ControllerBase
    {
        private readonly IPushNotifcationService _pushNotifcationService;


        public PushNotificationSubscriptionsController(IPushNotifcationService pushNotifcationService)
        {
            _pushNotifcationService = pushNotifcationService;
        }

        [HttpPost("api/[controller]")]
        public async Task<IActionResult> Create([FromBody] PushNotificationSubscription subscription)
        {
            var result = await _pushNotifcationService.AddNewSubscriber(subscription, Request.GetBaseUrl());

            return !result.Item1 ? new StatusCodeResult(result.Item2) : new OkResult();
        }



    }
}
