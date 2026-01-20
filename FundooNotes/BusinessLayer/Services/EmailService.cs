using BusinessLayer.Interfaces;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendOtpAsync(string email, string otp)
    {
        var smtpSection = _config.GetSection("EmailSettings");

        var mail = new MailMessage
        {
            From = new MailAddress(
                smtpSection["SenderEmail"],
                smtpSection["SenderName"]
            ),
            Subject = "FundooNotes OTP Verification",
            Body = $"Your OTP is: {otp}"
        };

        mail.To.Add(email);

        using var smtp = new SmtpClient(
            smtpSection["SmtpServer"],
            int.Parse(smtpSection["Port"])
        )
        {
            Credentials = new NetworkCredential(
                smtpSection["SenderEmail"],
                smtpSection["AppPassword"]
            ),
            EnableSsl = bool.Parse(smtpSection["EnableSsl"]),
            UseDefaultCredentials = false
        };

        await smtp.SendMailAsync(mail);
    }
}
