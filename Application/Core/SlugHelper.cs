using System.Text;
using System.Text.RegularExpressions;

namespace Application.Core
{
  public static class SlugHelper
    {
        public static string GenerateSlug(string text)
    {
        // Türkçe karakterlerin İngilizce karşılıkları
        var turkishChars = new Dictionary<char, string>
        {
            { 'ç', "c" }, { 'Ç', "c" },
            { 'ğ', "g" }, { 'Ğ', "g" },
            { 'ı', "i" }, { 'I', "i" },
            { 'İ', "i"},
            { 'ö', "o" }, { 'Ö', "o" },
            { 'ş', "s" }, { 'Ş', "s" },
            { 'ü', "u" }, { 'Ü', "u" }
        };

        // Tüm karakterleri küçük harfe dönüştür
        text = text.ToLowerInvariant();

        // Türkçe karakterleri dönüştür
        var sb = new StringBuilder();
        foreach (char c in text)
        {
            if (turkishChars.ContainsKey(c))
            {
                sb.Append(turkishChars[c]);
            }
            else
            {
                sb.Append(c);
            }
        }

        // Geçersiz karakterleri sil ve boşlukları tire ile değiştir
        string slug = Regex.Replace(sb.ToString(), @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", "-").Trim('-');

        return slug;
    }
    }
}