using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
  public class DataContext : IdentityDbContext<IdentityUser>
  {
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<News> News { get; set; }
    public DbSet<Article> Articles { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Gallery> Galleries { get; set; }
    public DbSet<GalleryImage> GalleryImage { get; set; }
    public DbSet<Image> Images { get; set; }
    public DbSet<Area> Areas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      base.OnModelCreating(modelBuilder);

      modelBuilder.Entity<Category>()
        .HasMany(x => x.Articles)
        .WithOne(x => x.Category)
        .OnDelete(DeleteBehavior.SetNull);

    }

  }
}