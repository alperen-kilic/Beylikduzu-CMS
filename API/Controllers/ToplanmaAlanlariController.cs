using Application.Areas;
using Application.Core;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class ToplanmaAlanlariController : BaseApiController
  {
    [HttpGet] // /api/toplanmaalanlari
    public async Task<IActionResult> GetAreas([FromQuery] PagingParams param)
    {
      return HandlePagedResult(await Mediator.Send(new List.Query { Params = param }));
    }

    [HttpGet("{id}")] // /api/toplanmaalanlari/{id}
    public async Task<IActionResult> GetArea(int id)
    {
      return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
    }

    [Authorize]
    [HttpPost] // /api/toplanmaalanlari/
    public async Task<IActionResult> CreateArea(Area area)
    {
      return HandleResult(await Mediator.Send(new Create.Command { Area = area }));
    }

    [Authorize]
    [HttpPut("{id}")] // /api/toplanmaalanlari/{id}
    public async Task<IActionResult> EditArea(int id, Area area)
    {
      area.Id = id;
      return HandleResult(await Mediator.Send(new Edit.Command { Area = area }));
    }

    [Authorize]
    [HttpDelete("{id}")] // /api/toplanmaalanlari/{id}
    public async Task<IActionResult> DeleteArea(int id)
    {
      return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
    }
  }
}