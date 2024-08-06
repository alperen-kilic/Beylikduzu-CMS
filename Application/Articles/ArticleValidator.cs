using Domain;
using FluentValidation;

namespace Application.Articles
{
  public class ArticleValidator : AbstractValidator<ArticleDto>
  {
    public ArticleValidator()
    {
      RuleFor(x => x.Title).NotEmpty().WithMessage("Makale başlığı boş bırakılamaz.");
      RuleFor(x => x.FullText).NotEmpty().WithMessage("Makale içeriği boş bırakılamaz.");
    }
  }
}