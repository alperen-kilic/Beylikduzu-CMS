using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Articles
{
  public class Details
  {
    public class Query : IRequest<Result<ArticleDto>>
    {
      public int Id { get; set; }
      public string Slug { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<ArticleDto>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
        _mapper = mapper;
        _context = context;
      }

      public async Task<Result<ArticleDto>> Handle(Query request, CancellationToken cancellationToken)
      {
        /* Find item from database with given ID */
        var article = await _context.Articles.ProjectTo<ArticleDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync(x => x.Id == request.Id && x.Slug == request.Slug && x.IsActive);

        /* Done! */
        return Result<ArticleDto>.Success(article);
      }
    }
  }
}