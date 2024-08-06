namespace Domain
{
  public class GalleryImage
  {
    public int Id { get; set; }
    public int Order { get; set; }
    public string ImageUrl { get; set; }
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
  }
}