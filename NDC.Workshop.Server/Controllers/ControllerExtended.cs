using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace NDC.Workshop.Server.Controllers
{
    public static class RequestExtensions    {

        public static string GetBaseUrl(this HttpRequest request)
        {
            var scheme = request.Scheme;
            var host = request.Host;

            return $"{scheme}://{host}/";
        }
    }
}
