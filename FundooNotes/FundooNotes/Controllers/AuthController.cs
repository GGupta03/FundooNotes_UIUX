using BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using ModelLayer.DTOs.Auth;
using System;

namespace FundooNotes.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // ---------------- REGISTER ----------------
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.Email))
                {
                    return BadRequest(new { message = "Email is required" });
                }

                await _authService.RegisterAsync(dto);
                return Ok(new
                {
                    message = "OTP sent for registration. Please verify your email."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ---------------- VERIFY OTP ----------------
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto dto)
        {
            try
            {
                var token = await _authService.VerifyOtpAsync(dto);

                // REGISTER OTP → no token
                if (token == null)
                {
                    return Ok(new
                    {
                        message = "Email verified successfully. You can now login."
                    });
                }

                // LOGIN OTP → token returned
                return Ok(new
                {
                    message = "Login successful",
                    token = token
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ---------------- LOGIN ----------------
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                if (dto == null || string.IsNullOrWhiteSpace(dto.Email))
                {
                    return BadRequest(new { message = "Email is required" });
                }

                await _authService.LoginAsync(dto);
                return Ok(new
                {
                    message = "OTP sent for login verification"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ---------------- FORGOT PASSWORD ----------------
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            try
            {
                await _authService.ForgotPasswordAsync(dto);
                return Ok(new
                {
                    message = "OTP sent for password reset"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ---------------- RESET PASSWORD ----------------
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            try
            {
                await _authService.ResetPasswordAsync(dto);
                return Ok(new
                {
                    message = "Password reset successful"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
