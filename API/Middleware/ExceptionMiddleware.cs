using System.Net;
using System.Text.Json;
using API.Errors;

namespace API.Middleware;

public class ExceptionMiddleware
{
    // this is a function that can process HTTP Request
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // if there is no exception, we want the middleware to move on to the next piece of middleware
            await _next(context); // this means that if there is no exception, then request moves on to its next stage else we want to catch it
        }
        catch (Exception e)
        {
            _logger.LogError(e, e.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError; //set statusCode to be 500 internal error

            var response = _env.IsDevelopment() //check to see if we are in development mode
                ? new ApiException((int)HttpStatusCode.InternalServerError, e.Message, e.StackTrace.ToString())
                : new ApiException((int)HttpStatusCode.InternalServerError);

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }; // make sure the response is in camelCase
            var json = JsonSerializer.Serialize(response, options);

            await context.Response.WriteAsync(json);
        }
    }
}