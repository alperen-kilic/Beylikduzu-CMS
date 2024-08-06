using Application.Articles;
using Application.News;
using Application.Search;
using AutoMapper;
using Domain;

namespace Application.Core
{
  public class MappingProfiles : Profile
  {
    public MappingProfiles()
    {
      CreateMap<Domain.News, Domain.News>();
      CreateMap<Domain.News, NewsDto>();
      CreateMap<NewsDto, Domain.News>();
      CreateMap<Article, Article>();
      CreateMap<Area, Area>();
      CreateMap<ArticleDto, Article>();
      CreateMap<Article, ArticleDto>()
        .ForMember(x => x.Category, o => o.MapFrom(s => s.Category ?? null))
        .ForMember(x => x.CategoryId, o => o.MapFrom(s => s.Category.Id))
        .ForMember(x => x.Id, o => o.MapFrom(s => s.Id));
      CreateMap<Category, Category>();
      CreateMap<Category, CategoryDto>();
      CreateMap<Domain.News, SearchDto>()
        .ForMember(x => x.Title, o => o.MapFrom(s => s.Title))
        .ForMember(x => x.Type, o => o.MapFrom(s => "news"))
        .ForMember(x => x.Url, o => o.MapFrom(s => $"/haberler/{s.Id}/{s.Slug}"))
        .ForMember(x => x.Description, o => o.MapFrom(s => s.Description))
        .ForMember(x => x.Image, o => o.MapFrom(s => s.ImageUrl))
        .ForMember(x => x.Date, o => o.MapFrom(s => s.CreatedAt));
      CreateMap<Article, SearchDto>()
        .ForMember(x => x.Title, o => o.MapFrom(s => s.Title))
        .ForMember(x => x.Type, o => o.MapFrom(s => "articles"))
        .ForMember(x => x.Url, o => o.MapFrom(s => $"/makaleler/{s.Id}/{s.Slug}"))
        .ForMember(x => x.Image, o => o.MapFrom(s => s.ImageUrl))
        .ForMember(x => x.Date, o => o.MapFrom(s => s.CreatedAt));
    }
  }
}