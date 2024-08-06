using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Areas
{
  public class Details
  {
    public class Query : IRequest<Result<Area>>
    {
      public int Id { get; set; }
    }

    public class Handler(DataContext context) : IRequestHandler<Query, Result<Area>>
    {
      private readonly DataContext _context = context;

      public async Task<Result<Area>> Handle(Query request, CancellationToken cancellationToken)
      {
        var area = await _context.Areas.FindAsync(request.Id);

        return Result<Area>.Success(area);
      }
    }
  }
}