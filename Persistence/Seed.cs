using Domain;

namespace Persistence
{
  public static class Seed
  {
    public static async Task SeedData(DataContext context
        )
    {
      if (!context.Galleries.Where(x => x.Id == -1).Any())
      {
        var gallery = new Gallery
        {
          Id = -1,
          GalleryImages = new List<GalleryImage> { }
        };

        await context.Galleries.AddAsync(gallery);
      }
      if (!context.Galleries.Where(x => x.Id == -2).Any())
      {
        var gallery = new Gallery
        {
          Id = -2,
          GalleryImages = new List<GalleryImage> { }
        };

        await context.Galleries.AddAsync(gallery);
      }
      if (!context.Galleries.Where(x => x.Id == -3).Any())
      {
        var gallery = new Gallery
        {
          Id = -3,
          GalleryImages = new List<GalleryImage> { }
        };

        await context.Galleries.AddAsync(gallery);
      }
      await context.SaveChangesAsync();
    }
  }
}
