using Application.Categories;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class CategoriesController : BaseApiController
  {
    [HttpGet] // /api/categories
    public async Task<IActionResult> GetCategories()
    {
      return HandleResult(await Mediator.Send(new List.Query { }));
    }

    [HttpGet("{id}")] // /api/categories/{id}
    public async Task<IActionResult> GetCategorySingle(int id)
    {
      return HandleResult(await Mediator.Send(new Details.Query { Id = id }));
    }

    [Authorize]
    [HttpPost] // /api/categories/
    public async Task<IActionResult> CreateCategory(Category category)
    {
      return HandleResult(await Mediator.Send(new Create.Command { Category = category }));
    }

    [Authorize]
    [HttpPut("{id}")] // /api/categories/{id}
    public async Task<IActionResult> EditCategory(int id, Category category)
    {
      category.Id = id;
      return HandleResult(await Mediator.Send(new Edit.Command { Category = category }));
    }

    [Authorize]
    [HttpDelete("{id}")] // /api/categories/{id}
    public async Task<IActionResult> DeleteCategory(int id)
    {
      return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
    }
  }
}