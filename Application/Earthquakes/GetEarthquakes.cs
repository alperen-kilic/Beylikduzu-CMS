using System.Net.Http.Json;
using Application.Core;
using Domain;
using MediatR;

namespace Application.Earthquakes
{
  public class GetEarthquakes
  {
    public class Query : IRequest<Result<List<Earthquake>>>
    {
    }

    public class Handler(HttpClient httpClient) : IRequestHandler<Query, Result<List<Earthquake>>>
    {
      private readonly HttpClient _httpClient = httpClient;

      public async Task<Result<List<Earthquake>>> Handle(Query request, CancellationToken cancellationToken)
      {
        _httpClient.BaseAddress = new Uri("https://deprem.afad.gov.tr");
        var response = await _httpClient.GetAsync($"apiv2/event/filter?start={DateTime.Now.AddDays(-5):yyyy-MM-dd}&end={DateTime.Now.AddDays(1):yyyy-MM-dd}&minmag=3.0&orderby=timedesc");
        if (response.IsSuccessStatusCode)
        {
          var earthquakes = await response.Content.ReadFromJsonAsync<List<Earthquake>>();
          earthquakes = earthquakes.Where(x => x.Country == "Türkiye").Select(c => { c.Date = c.Date.AddHours(3); return c; }).ToList();
          return Result<List<Earthquake>>.Success(earthquakes);
        }
        else
        {
          return Result<List<Earthquake>>.Failure("Deprem verileri alınamadı.");
        }
      }
    }
  }
}