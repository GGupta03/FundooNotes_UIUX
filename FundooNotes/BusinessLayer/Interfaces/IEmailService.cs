namespace BusinessLayer.Interfaces
{
    public interface IEmailService
    {
        Task SendOtpAsync(string email, string otp);
    }
}
