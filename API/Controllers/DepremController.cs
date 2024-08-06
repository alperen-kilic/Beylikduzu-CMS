using Application.Earthquakes;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class DepremController : BaseApiController
  {
    [HttpGet]
    public async Task<IActionResult> ListEarthquakes()
    {
      return HandleResult(await Mediator.Send(new GetEarthquakes.Query { }));
    }
  }
}