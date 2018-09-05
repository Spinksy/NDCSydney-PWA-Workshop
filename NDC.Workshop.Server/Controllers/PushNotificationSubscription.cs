namespace NDC.Workshop.Server.Controllers
{
    public class PushNotificationSubscription
    {
        public string Key { get; set; }
        public string Endpoint { get; set; }
        public string AuthSecret { get; set; }
    }
}