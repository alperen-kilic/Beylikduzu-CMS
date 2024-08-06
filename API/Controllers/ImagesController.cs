
using Application.Images;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class ImagesController : BaseApiController
  {

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
      return HandleResult(await Mediator.Send(new UploadImage.Command { File = file }));
    }

    [HttpGet("gallery/{id}")]
    public async Task<IActionResult> GetGallery(int id)
    {
      return HandleResult(await Mediator.Send(new GetGallery.Query { Id = id }));
    }

    [Authorize]
    [HttpPost("gallery/{id}")]
    public async Task<IActionResult> UploadToGallery([FromForm] List<IFormFile> FileList, int id)
    {
      return HandleResult(await Mediator.Send(new UploadToGallery.Command { FileList = FileList, Id = id }));
    }

    [Authorize]
    [HttpDelete("gallery/{id}")]
    public async Task<IActionResult> DeleteGalleryImage(int id)
    {
      return HandleResult(await Mediator.Send(new DeleteGalleryImage.Command { Id = id }));
    }

    [Authorize]
    [HttpPut("gallery/{id}/setOrders")]
    public async Task<IActionResult> SetGalleryOrders(int id, List<GalleryImage> galleryImages)
    {
      return HandleResult(await Mediator.Send(new SetGalleryOrders.Command { GalleryId = id, GalleryImages = galleryImages }));
    }
  }
}