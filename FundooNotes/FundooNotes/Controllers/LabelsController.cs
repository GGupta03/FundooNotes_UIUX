using BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ModelLayer.DTOs.Labels;
using System.Security.Claims;

namespace FundooNotes.Controllers
{
    [ApiController]
    [Route("api/labels")]
    [Authorize]
    public class LabelsController : ControllerBase
    {
        private readonly ILabelService _labelService;

        public LabelsController(ILabelService labelService)
        {
            _labelService = labelService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        }

        // GET /api/labels
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var labels = await _labelService.GetAllAsync(GetUserId());
            return Ok(labels);
        }

        // POST /api/labels
        [HttpPost]
        public async Task<IActionResult> Create(CreateLabelDto dto)
        {
            await _labelService.CreateAsync(dto, GetUserId());
            return Ok("Label created successfully");
        }

        // PUT /api/labels/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateLabelDto dto)
        {
            await _labelService.UpdateAsync(id, dto, GetUserId());
            return Ok("Label updated successfully");
        }

        // DELETE /api/labels/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _labelService.DeleteAsync(id, GetUserId());
            return Ok("Label deleted successfully");
        }
    }
}
