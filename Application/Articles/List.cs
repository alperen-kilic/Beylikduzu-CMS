using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Articles
{
  public class List
  {
    public class Query : IRequest<Result<PagedList<ArticleDto>>>
    {
      public PagingParams Params { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<PagedList<ArticleDto>>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
        _mapper = mapper;
        _context = context;
      }

      public async Task<Result<PagedList<ArticleDto>>> Handle(Query request, CancellationToken cancellationToken)
      {
        var query = _context.Articles.Where(x => !x.IsDeleted).Include(a => a.Category).OrderByDescending(d => d.CreatedAt).ProjectTo<ArticleDto>(_mapper.ConfigurationProvider).AsQueryable();

        return Result<PagedList<ArticleDto>>.Success(
          await PagedList<ArticleDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
        );
      }
    }
  }
}