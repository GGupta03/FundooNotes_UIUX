using ModelLayer.DTOs.Auth;

namespace BusinessLayer.Interfaces
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterDto dto);
        Task LoginAsync(LoginDto dto);
        Task<string?> VerifyOtpAsync(VerifyOtpDto dto);

        Task ForgotPasswordAsync(ForgotPasswordDto dto);
        Task ResetPasswordAsync(ResetPasswordDto dto);
    }
}
