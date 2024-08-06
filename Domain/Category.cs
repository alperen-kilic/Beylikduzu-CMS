using System.ComponentModel.DataAnnotations;

namespace Domain
{
  public class Category
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public ICollection<Article> Articles { get; set; }
  }
}