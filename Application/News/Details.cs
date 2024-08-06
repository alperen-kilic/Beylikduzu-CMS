using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.News
{
  public class Details
  {
    public class Query : IRequest<Result<Domain.News>>
    {
      public int Id { get; set; }
      public string Slug { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<Domain.News>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<Result<Domain.News>> Handle(Query request, CancellationToken cancellationToken)
      {
        /* Find news item from database with given ID */
        var news = await _context.News.Include(x => x.Gallery).ThenInclude(x => x.GalleryImages.OrderBy(i => i.Order)).FirstOrDefaultAsync(x => x.Id == request.Id && x.Slug == request.Slug && x.IsActive);

        /* Done! */
        return Result<Domain.News>.Success(news);
      }
    }
  }
}