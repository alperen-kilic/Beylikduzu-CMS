using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Articles
{
  public class Create
  {
    public class Command : IRequest<Result<ArticleDto>>
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

    public class Handler : IRequestHandler<Command, Result<ArticleDto>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
        _mapper = mapper;
        _context = context;
      }

      public async Task<Result<ArticleDto>> Handle(Command request, CancellationToken cancellationToken)
      {
        /* Set default values for created article */
        var category = await _context.Categories.FirstOrDefaultAsync(x => x.Id == request.Article.CategoryId);
        var article = new Article
        {
          Title = request.Article.Title,
          FullText = request.Article.FullText,
          ImageUrl = request.Article.ImageUrl,
          IsActive = request.Article.IsActive,
          IsDeleted = false,
          Category = category,
        };
        article.Slug = SlugHelper.GenerateSlug(article.Title);
        
        var savedArticle = await _context.Articles.AddAsync(article);
        

        var result = await _context.SaveChangesAsync() > 0;
        
        var rArticle = _mapper.Map<ArticleDto>(savedArticle.Entity);

        if (!result) return Result<ArticleDto>.Failure("Makale oluşturulamadı.");

        return Result<ArticleDto>.Success(rArticle);
      }

    }
  }
}