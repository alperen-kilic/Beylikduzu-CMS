namespace Domain
{
  public class Gallery
  {
    public int Id { get; set; }
    public ICollection<GalleryImage> GalleryImages { get; set; } = new List<GalleryImage>();
  }
}