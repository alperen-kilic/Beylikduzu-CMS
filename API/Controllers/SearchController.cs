using Application.Search;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class SearchController : BaseApiController
  {
    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string searchText)
    {
      return HandleResult(await Mediator.Send(new List.Query { SearchText = searchText }));
    }

  }
}