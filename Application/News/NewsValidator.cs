using FluentValidation;

namespace Application.News
{
  public class NewsValidator : AbstractValidator<Domain.News>
  {
    public NewsValidator()
    {
      RuleFor(x => x.Title).NotEmpty().WithMessage("Haber başlığı boş bırakılamaz.");
      RuleFor(x => x.Description).NotEmpty().WithMessage("Haber açıklaması boş bırakılamaz.").Must(x => x != null && x.Length >= 20).WithMessage("Açıklama kısmı en az 20 karakter olmalıdır.");
      RuleFor(x => x.FullText).NotEmpty().WithMessage("Haber içeriği boş bırakılamaz.");
    }
  }
}