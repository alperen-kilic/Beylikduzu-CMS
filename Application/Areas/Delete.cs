using Application.Core;
using MediatR;
using Persistence;

namespace Application.Areas
{
  public class Delete
  {
    public class Command : IRequest<Result<Unit>>
    {
      public int Id { get; set; }
    }

    public class Handler(DataContext context) : IRequestHandler<Command, Result<Unit>>
    {
      private readonly DataContext _context = context;

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        var area = await _context.Areas.FindAsync(request.Id);

        if (area == null) return null;

        _context.Remove(area);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return Result<Unit>.Failure("Toplanma alanı silinemedi.");

        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}