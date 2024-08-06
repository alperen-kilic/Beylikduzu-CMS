using System.Text;
using System.Text.RegularExpressions;
using Application.Core;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.News
{
  public class Create
  {
    public class Command : IRequest<Result<Domain.News>>
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

    public class Handler : IRequestHandler<Command, Result<Domain.News>>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<Result<Domain.News>> Handle(Command request, CancellationToken cancellationToken)
      {
        request.News.Gallery = new Domain.Gallery
        {
          Id = request.News.Id,
          GalleryImages = new List<Domain.GalleryImage>()
        };

        request.News.Slug = SlugHelper.GenerateSlug(request.News.Title);
        /* Add given news item to database */
        var savedNews = await _context.News.AddAsync(request.News);

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return Result<Domain.News>.Failure("Haber oluşturulamadı.");

        return Result<Domain.News>.Success(savedNews.Entity);
      }
    }
  }
}