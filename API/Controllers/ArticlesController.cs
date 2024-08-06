using Application.Articles;
using Application.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class ArticlesController : BaseApiController
  {
    [HttpGet] // /api/articles
    public async Task<IActionResult> GetArticles([FromQuery] PagingParams param)
    {
      return HandlePagedResult(await Mediator.Send(new List.Query { Params = param }));
    }

    [HttpGet("{id}/{slug}")] // /api/articles/{id}
    public async Task<IActionResult> GetArticleSingle(int id, string slug)
    {
      return HandleResult(await Mediator.Send(new Details.Query { Id = id, Slug = slug}));
    }

    [Authorize]
    [HttpPost] // /api/articles/
    public async Task<IActionResult> CreateArticle(ArticleDto article)
    {
      return HandleResult(await Mediator.Send(new Create.Command { Article = article }));
    }

    [Authorize]
    [HttpPut("{id}")] // /api/articles/{id}
    public async Task<IActionResult> EditArticle(int id, ArticleDto article)
    {
      article.Id = id;
      return HandleResult(await Mediator.Send(new Edit.Command { Article = article }));
    }

    [Authorize]
    [HttpDelete("{id}")] // /api/articles/{id}
    public async Task<IActionResult> DeleteArticle(int id)
    {
      return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
    }
  }
}