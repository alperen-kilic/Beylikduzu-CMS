using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.News
{
  public class List
  {
    public class Query : IRequest<Result<PagedList<Domain.News>>>
    {
      public PagingParams Params { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<PagedList<Domain.News>>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<Result<PagedList<Domain.News>>> Handle(Query request, CancellationToken cancellationToken)
      {
        var query = _context.News.Where(x => !x.IsDeleted).Include(x => x.Gallery).ThenInclude(x => x.GalleryImages.OrderBy(x => x.Order)).OrderByDescending(d => d.CreatedAt).AsQueryable();

        return Result<PagedList<Domain.News>>.Success(
          await PagedList<Domain.News>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
        );
      }
    }
  }
}