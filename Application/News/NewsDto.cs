using Microsoft.AspNetCore.Http;

namespace Application.News
{
  public class NewsDto
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string FullText { get; set; }
    public IFormFile Image { get; set; }
    public string ImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
  }
}