using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore.Update.Internal;
using Persistence;

namespace Application.Images
{
  public class DeleteGalleryImage
  {
    public class Command : IRequest<Result<Unit>>
    {
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
        Console.WriteLine("DeleteGalleryImage.Handler - Run");
        Console.WriteLine("DeleteGalleryImage.Handler - request.Id: " + request.Id);
        var image = await _context.GalleryImage.FindAsync(request.Id);

        if (image == null) return null;

        _context.GalleryImage.Remove(image);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return Result<Unit>.Failure("Resim silinemedi.");

        return Result<Unit>.Success(Unit.Value);
      }
    }
  }

}