using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Articles
{
  public class Edit
  {
    public class Command : IRequest<Result<Unit>>
    {
      public ArticleDto Article { get; set; }
    }

    public class CommandValidator : AbstractValidator<Command>
    {
      public CommandValidator()
      {
        RuleFor(x => x.Article).SetValidator(new ArticleValidator());
      }
    }

    public class Handler(DataContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
    {
      private readonly IMapper _mapper = mapper;
      private readonly DataContext _context = context;

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        /* Search item in database */
        var article = await _context.Articles.FindAsync(request.Article.Id);

        /* Return null and handle it if not found */
        if (article == null) return null;

        /* Update fields based on given object */
        var createdAt = article.CreatedAt;
        _mapper.Map(request.Article, article);
        article.UpdatedAt = DateTime.UtcNow;
        article.CreatedAt = createdAt;

        if (request.Article.CategoryId.HasValue)
        {
          var category = await _context.Categories.FindAsync(request.Article.CategoryId);
          article.Category = category;
        }

        article.Slug = SlugHelper.GenerateSlug(article.Title);

        /* Save updated item to database */
        var result = await _context.SaveChangesAsync() > 0;

        /* Handle if can't save to database */
        if (!result) return Result<Unit>.Failure("Makale güncellenemedi.");

        /* Done! */
        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}