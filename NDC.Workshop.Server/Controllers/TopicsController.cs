using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Extensions.Options;
using NDC.Workshop.Server.Configuration;
using NDC.Workshop.Server.Models;
using NDC.Workshop.Server.Services;

namespace NDC.Workshop.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TopicsController : ControllerBase
    {
        private readonly CosmosDbConfiguration _cosmosConfig;
        private readonly DocumentClient _client;
        private readonly IPushNotifcationService _notifcationService;

        public TopicsController(IOptions<CosmosDbConfiguration> cosmosConfig, DocumentClient client, IPushNotifcationService notifcationService)
        {
            _cosmosConfig = cosmosConfig.Value;
            _client = client;
            _notifcationService = notifcationService;
        }

        [HttpGet]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        public IActionResult GetTopics()
        {
            try
            {
                var topics = GetTopicsFromDb();
                return Ok(topics);

            }
            catch
            {
                return NotFound();
            }

        }

        [HttpGet("{id}", Name ="GetTopicById")]
        public async Task<IActionResult> GetTopic( string id)
        {
            var topic = await GetTopicByIdAsync(id);

            return new OkObjectResult(topic);
        }

        [HttpPost]
        public async Task<IActionResult> AddTopic([FromBody] NewTopic newTopic)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid topic");
            }

            return await AddTopicToDb(newTopic);

        }

        private async Task<IActionResult> AddTopicToDb(NewTopic newTopic)
        {
            var topicToAdd = new Topic
            {
                Title = newTopic.Title,
                Text = newTopic.Text,
                Date = DateTime.Now
            };

            var uri = UriFactory.CreateDocumentCollectionUri(_cosmosConfig.DefaultDb,
                _cosmosConfig.TopicsCollection);
            try
            {
                var savedDoc = await _client.CreateDocumentAsync(uri, topicToAdd);
                Topic savedTopic = (dynamic)savedDoc;

                var notificationMessage = $"Topic added: {topicToAdd.Title}";
                await _notifcationService.SendNotificationToSubscribers(notificationMessage, Request.GetBaseUrl());

                //change to created
                return Ok();
            }
            catch (DocumentClientException de)
            {
                return BadRequest(de.Message);
            }
        }

        private List<Topic> GetTopicsFromDb()
        {
            var results =
                _client.CreateDocumentQuery<Topic>(UriFactory.CreateDocumentCollectionUri(
                        _cosmosConfig.DefaultDb, _cosmosConfig.TopicsCollection)).AsEnumerable()
                    .OrderByDescending(t => t.Date)
                    .Take(40);


            return results.ToList();
        }

        private async Task<Topic> GetTopicByIdAsync(string id)
        {
            var uri = UriFactory.CreateDocumentUri(_cosmosConfig.DefaultDb, _cosmosConfig.TopicsCollection, id);

            var topic = await _client.ReadDocumentAsync<Topic>(uri);

            return topic;
        }
    }
}