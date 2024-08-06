namespace Domain
{
  public class Article
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public string Slug { get; set; }
    public string FullText { get; set; }
    public string ImageUrl { get; set; }
    public bool IsActive { get; set; }
    public bool IsDeleted { get; set; }
    public Category Category { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
  }
}