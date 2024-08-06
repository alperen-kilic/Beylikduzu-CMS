
using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Images
{
  public class GetGallery
  {
    public class Query : IRequest<Result<Gallery>>
    {
      public int Id { get; set; }
    }

    public class Handler(DataContext context) : IRequestHandler<Query, Result<Gallery>>
    {
      private readonly DataContext _context = context;

      public async Task<Result<Gallery>> Handle(Query request, CancellationToken cancellationToken)
      {
        var gallery = await _context.Galleries.Where(x => x.Id == request.Id).Include(x => x.GalleryImages.OrderBy(x => x.Order)).SingleOrDefaultAsync();
        return Result<Gallery>.Success(gallery);
      }
    }
  }
}