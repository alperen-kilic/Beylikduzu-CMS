using Application.Core;
using MediatR;
using Persistence;

namespace Application.Articles
{
  public class Delete
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
        /* Find item from database with given ID */
        var article = await _context.Articles.FindAsync(request.Id);

        /* If item does not exists return null and handle it */
        if (article == null) return null;

        /* Set "isDeleted" to true. Soft delete for recover purposes */
        article.IsDeleted = true;
        article.UpdatedAt = DateTime.UtcNow;

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return Result<Unit>.Failure("Makale silinemedi.");

        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}