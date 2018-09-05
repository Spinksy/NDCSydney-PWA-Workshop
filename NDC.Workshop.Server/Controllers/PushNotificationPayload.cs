using Newtonsoft.Json;

namespace NDC.Workshop.Server.Controllers
{
    public class PushNotificationPayload
    {
        [JsonProperty("msg")]
        public string Msg { get; set; }
        [JsonProperty("icon")]
        public string Icon { get; set; }
    }
}