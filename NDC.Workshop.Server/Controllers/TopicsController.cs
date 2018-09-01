using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Extensions.Options;
using NDC.Workshop.Server.Configuration;

namespace NDC.Workshop.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TopicsController : ControllerBase
    {
        private readonly IOptions<CosmosDbConfiguration> _cosmosConfig;
        private readonly DocumentClient _client;

        public TopicsController(IOptions<CosmosDbConfiguration> cosmosConfig, DocumentClient client)
        {
            _cosmosConfig = cosmosConfig;
            _client = client;
        }

        [HttpGet]
        [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
        public IActionResult GetTopics()
        {
            try
            {
                var topics = TempGetFromDb();
                return Ok(topics);

            }
            catch
            {
                return NotFound();
            }

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

            var uri = UriFactory.CreateDocumentCollectionUri(_cosmosConfig.Value.DefaultDb,
                _cosmosConfig.Value.DefaultCollection);
            try
            {
                var savedTopic = await _client.CreateDocumentAsync(uri, topicToAdd);
                //change to created
                return Ok();
            }
            catch (DocumentClientException de)
            {
                return BadRequest(de.Message);
            }
        }

        private List<Topic> TempGetFromDb()
        {
            var results =
                _client.CreateDocumentQuery<Topic>(UriFactory.CreateDocumentCollectionUri(
                        _cosmosConfig.Value.DefaultDb, _cosmosConfig.Value.DefaultCollection)).AsEnumerable()
                    .OrderByDescending(t => t.Date)
                    .Take(10);


            return results.ToList();
        }
    }
}