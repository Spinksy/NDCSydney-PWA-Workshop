using System;
using Newtonsoft.Json;

namespace NDC.Workshop.Server.Controllers
{
    public class Topic
    {
        [JsonProperty("id")]
        public string Id { get; set; }
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("text")]
        public string Text { get; set; }
        [JsonProperty("date")]
        public DateTime Date { get; set; }
    }
}