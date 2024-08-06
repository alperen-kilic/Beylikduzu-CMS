using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Areas
{
  public class List
  {
    public class Query : IRequest<Result<PagedList<Area>>>
    {
      public PagingParams Params { get; set; }
    }

    public class Handler(DataContext context) : IRequestHandler<Query, Result<PagedList<Area>>>
    {
      private readonly DataContext _context = context;

      public async Task<Result<PagedList<Area>>> Handle(Query request, CancellationToken cancellationToken)
      {
        var query = _context.Areas.OrderByDescending(d => d.CreatedAt).AsQueryable();

        return Result<PagedList<Area>>.Success(
          await PagedList<Area>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
        );
      }
    }
  }
}