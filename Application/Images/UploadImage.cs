using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Application.Images
{
  public class UploadImage
  {
    public class Command : IRequest<Result<string>>
    {
      public IFormFile File { get; set; }
    }

    public class Handler : IRequestHandler<Command, Result<string>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;

      }

      public async Task<Result<string>> Handle(Command request, CancellationToken cancellationToken)
      {
        var image = request.File;

        if (image == null) return null;

        // Check if the file is an image with .jpg, .jpeg, .png, .svg, .webp, .gif extensions
        var allowedExtensions = new[] { "jpg", "jpeg", "png", "svg", "webp", "gif" };

        if (!allowedExtensions.Contains(image.FileName.Split('.').LastOrDefault()))
        {
          return Result<string>.Failure("Dosya uzantısı desteklenmiyor.");
        }

        // Check if the file is less than or equal to 3MB
        if (image.Length > 3 * 1024 * 1024)
        {
          return Result<string>.Failure("Dosya boyutu 3MB'dan büyük olamaz.");
        }

        var imageExtension = image.FileName.Split('.').LastOrDefault();
        var imageName = Guid.NewGuid() + "." + imageExtension;
        var imagePath = Path.Combine("wwwroot/assets/content/images", imageName);

        using (var fileStream = new FileStream(imagePath, FileMode.Create))
        {
          await image.CopyToAsync(fileStream);
        }

        // Return the full path of the image with the domain name
        return Result<string>.Success("https://afetdenetim.beylikduzu.istanbul/assets/content/images/" + imageName);
      }
    }
  }
}