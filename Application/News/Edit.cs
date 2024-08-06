using Application.Core;
using AutoMapper;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.News
{
  public class Edit
  {
    public class Command : IRequest<Result<Unit>>
    {
      public Domain.News News { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(x => x.News).SetValidator(new NewsValidator());
      }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>>
    {
      private readonly IMapper _mapper;
      private readonly DataContext _context;
      public Handler(DataContext context, IMapper mapper)
      {
        _context = context;
        _mapper = mapper;
      }

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        /* Search for news item in database */
        var news = await _context.News.FindAsync(request.News.Id);

        /* Return null and handle it if not found */
        if (news == null) return null;

        /* Update fields based on given news object */
        var createdAt = news.CreatedAt;
        _mapper.Map(request.News, news);
        news.UpdatedAt = DateTime.UtcNow;
        news.CreatedAt = createdAt;
        news.Slug = SlugHelper.GenerateSlug(news.Title);

        /* Save updated news item to database */
        var result = await _context.SaveChangesAsync() > 0;

        /* Handle if can't save to database */
        if (!result) return Result<Unit>.Failure("Haber güncellenemedi.");

        /* Done! */
        return Result<Unit>.Success(Unit.Value);
      }

            
    }
  }
}