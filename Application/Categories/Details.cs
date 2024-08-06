using Application.Articles;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Categories
{
  public class Details
  {
    public class Query : IRequest<Result<CategoryDto>>
    {
      public int Id { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<CategoryDto>>
    {
      private readonly DataContext _context;
      private readonly IMapper _mapper;
      public Handler(DataContext context, IMapper mapper)
      {
        _mapper = mapper;
        _context = context;
      }

      public async Task<Result<CategoryDto>> Handle(Query request, CancellationToken cancellationToken)
      {
        var category = await _context.Categories.ProjectTo<CategoryDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync(x => x.Id == request.Id);

        return Result<CategoryDto>.Success(category);
      }
    }
  }
}