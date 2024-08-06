using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Areas
{
  public class Create
  {
    public class Command : IRequest<Result<Area>>
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

    public class Handler(DataContext context) : IRequestHandler<Command, Result<Area>>
    {
      private readonly DataContext _context = context;

      public async Task<Result<Area>> Handle(Command request, CancellationToken cancellationToken)
      {
        var savedArea = await _context.Areas.AddAsync(request.Area);
        var result = await _context.SaveChangesAsync() > 0;

        if (!result) return Result<Area>.Failure("Toplanma alanı oluşturulamadı.");

        return Result<Area>.Success(savedArea.Entity);
      }
    }
  }




}