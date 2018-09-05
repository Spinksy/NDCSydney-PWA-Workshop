using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents.Client;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NDC.Workshop.Server.Configuration;
using NDC.Workshop.Server.Models;
using NDC.Workshop.Server.Services;

namespace NDC.Workshop.Server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var tempConfig = Configuration.GetSection("CosmosDb");
            services.AddOptions();
            services.Configure<CosmosDbConfiguration>(Configuration.GetSection("CosmosDb"));
            services.Configure<VapidSettings>(Configuration.GetSection("VapidSettings"));
            services.AddSingleton<IConfiguration>(Configuration);
            services.AddSingleton(new DocumentClient(new Uri(tempConfig["Url"]), tempConfig["AuthKey"]));
            services.AddSingleton<IPushNotifcationService, PushNotifcationService>();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

        }
        
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseMvc();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.Run(async (context) =>
            {
                context.Response.ContentType = "text/html";
                await context.Response.SendFileAsync(Path.Combine(env.WebRootPath, "index.html"));
            });

        }
    }
}
