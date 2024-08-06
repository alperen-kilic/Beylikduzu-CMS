using Domain;

namespace Application.Articles
{
  public class ArticleDto
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public string Slug { get; set; }
    public string FullText { get; set; }
    public string ImageUrl { get; set; }
    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }
    public int? CategoryId { get; set; }
    public CategoryDto Category { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
  }
}