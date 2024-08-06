using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Areas
{
  public class Edit
  {
    public class Command : IRequest<Result<Unit>>
    {
      public Area Area { get; set; }
    }

    public class CommandValidator : AbstractValidator<Area>
    {
      public CommandValidator()
      {
        RuleFor(x => x.Title).NotEmpty();
        RuleFor(x => x.Address).NotEmpty();
        RuleFor(x => x.Lat).NotEmpty();
        RuleFor(x => x.Lng).NotEmpty();
      }
    }

    public class Handler(DataContext context, IMapper mapper) : IRequestHandler<Command, Result<Unit>>
    {
      private readonly IMapper _mapper = mapper;
      private readonly DataContext _context = context;

      public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
      {
        var area = await _context.Areas.FindAsync(request.Area.Id);

        if (area == null) return null;

        var createdAt = area.CreatedAt;
        _mapper.Map(request.Area, area);
        area.CreatedAt = createdAt;

        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return Result<Unit>.Failure("Toplanma alanı güncellenemedi.");

        return Result<Unit>.Success(Unit.Value);
      }
    }
  }
}