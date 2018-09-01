using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NDC.Workshop.Server.Configuration
{
    public class CosmosDbConfiguration
    {
        public string Url { get; set; }
        public string AuthKey { get; set; }
        public string DefaultDb { get; set; }
        public string DefaultCollection { get; set; }
    }
}
