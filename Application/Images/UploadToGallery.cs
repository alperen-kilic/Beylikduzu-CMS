using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Images
{
  public class UploadToGallery
  {
    public class Command : IRequest<Result<Unit>>
    {
      [FromForm]
      public List<IFormFile> FileList { get; set; }
      public int Id { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {

        var gallery = await _context.Galleries.Include(i => i.GalleryImages).FirstOrDefaultAsync(x => x.Id == request.Id);
        if (gallery == null) return null;
        int order = gallery.GalleryImages.Where(i => !i.IsDeleted).Count() + 1;
        var allowedExtensions = new[] { "jpg", "jpeg", "png", "svg", "webp", "gif" };
        Console.WriteLine("UploadToGallery.Handler - request.FileList.Count: " + request.FileList.Count);
        foreach (IFormFile image in request.FileList)
        {

          if (!allowedExtensions.Contains(image.FileName.Split('.').LastOrDefault()))
          {
            continue;
          }

          // Check if the file is less than or equal to 3MB
          if (image.Length > 3 * 1024 * 1024)
          {
            continue;
          }

          var imageExtension = image.FileName.Split('.').LastOrDefault();
          var imageName = Guid.NewGuid() + "." + imageExtension;
          var imagePath = Path.Combine("wwwroot/assets/content/images", imageName);

          using (var fileStream = new FileStream(imagePath, FileMode.Create))
          {
            await image.CopyToAsync(fileStream);
          }

          gallery.GalleryImages.Add(new GalleryImage
          {
            ImageUrl = "https://afetdenetim.beylikduzu.istanbul/assets/content/images/" + imageName,
            Order = order
          });

          _context.Galleries.Update(gallery);
          order += 1;

          // if (!result) return Result<Unit>.Failure("Resim galeriye eklenemedi.");

          // return Result<Unit>.Success(Unit.Value);
        }

        var result = await _context.SaveChangesAsync() > 0;
        if (!result) return Result<Unit>.Failure("Resimler galeriye eklenemedi.");
        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}