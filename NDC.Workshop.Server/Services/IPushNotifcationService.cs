using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using NDC.Workshop.Server.Models;
using WebPush;

namespace NDC.Workshop.Server.Services
{
    public interface IPushNotifcationService
    {
        Task SendNotificationToSubscribers(string message, string baseUrl);
        Task<(bool, int)> AddNewSubscriber(PushNotificationSubscription newSubscription, string baseUrl) ;
        Task DeleteSubscription(PushNotificationSubscription subscriptionToDelete);
    }
}