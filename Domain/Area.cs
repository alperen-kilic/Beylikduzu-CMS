using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
  public class Area
  {
    public int Id { get; set; }
    public string Title { get; set; }
    public string Address { get; set; }
    public string Lat { get; set; }
    public string Lng { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  }
}