using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Images
{
  public class SetGalleryOrders
  {
    public class Command : IRequest<Result<Unit>>
    {
      public int GalleryId { get; set; }
      public List<GalleryImage> GalleryImages { get; set; }
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
        var gallery = await _context.Galleries.Include(i => i.GalleryImages).FirstOrDefaultAsync(x => x.Id == request.GalleryId);
        if (gallery == null) return null;

        foreach (var galleryImage in request.GalleryImages)
        {
          var image = gallery.GalleryImages.FirstOrDefault(i => i.Id == galleryImage.Id);
          if (image != null)
          {
            image.Order = galleryImage.Order;
          }
        }

        var result = await _context.SaveChangesAsync() > 0;
        if (!result) return Result<Unit>.Failure("Galeri sıralaması güncellenirken bir hata oluştu.");

        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}