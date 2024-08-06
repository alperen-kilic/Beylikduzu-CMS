using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Search
{
  public class List
  {
    public class Query : IRequest<Result<List<SearchDto>>>
    {
      public string SearchText { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<SearchDto>>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
        _mapper = mapper;
        _context = context;

      }
      public async Task<Result<List<SearchDto>>> Handle(Query request, CancellationToken cancellationToken)
      {
        var news = await _context.News.Where(x => !x.IsDeleted && EF.Functions.ILike(x.Title, $"%{request.SearchText.ToUpper()}%")).ProjectTo<SearchDto>(_mapper.ConfigurationProvider).OrderByDescending(d => d.Date).ToListAsync();
        var articles = await _context.Articles.Where(x => !x.IsDeleted && EF.Functions.ILike(x.Title, $"%{request.SearchText.ToUpper()}%")).ProjectTo<SearchDto>(_mapper.ConfigurationProvider).OrderByDescending(d => d.Date).ToListAsync();

        var result = news.Concat(articles).OrderByDescending(d => d.Date).ToList();

        return Result<List<SearchDto>>.Success(result);
      }
    }
  }
}