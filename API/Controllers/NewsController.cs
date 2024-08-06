using Application.Core;
using Application.News;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class NewsController : BaseApiController
  {
    [HttpGet] // /api/news
    public async Task<IActionResult> GetNews([FromQuery] PagingParams param)
    {
      return HandlePagedResult(await Mediator.Send(new List.Query { Params = param }));
    }

    [HttpGet("{id}/{slug}")] // /api/news/{id}
    public async Task<IActionResult> GetNewsSingle(int id, string slug)
    {
      return HandleResult(await Mediator.Send(new Details.Query { Id = id, Slug = slug}));
    }

    [Authorize]
    [HttpPost] // /api/news/
    public async Task<IActionResult> CreateNews(News news)
    {
      return HandleResult(await Mediator.Send(new Create.Command { News = news }));
    }

    [Authorize]
    [HttpPut("{id}")] // /api/news/{id}
    public async Task<IActionResult> EditNews(int id, News news)
    {
      news.Id = id;
      return HandleResult(await Mediator.Send(new Edit.Command { News = news }));
    }

    [Authorize]
    [HttpDelete("{id}")] // /api/news/{id}
    public async Task<IActionResult> DeleteNews(int id)
    {
      return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
    }
  }
}