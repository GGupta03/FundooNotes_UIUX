namespace DataBaseLayer.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }

        public bool IsEmailVerified { get; set; }

        public string? Otp { get; set; }
        public DateTime? OtpExpiry { get; set; }
        public string? OtpPurpose { get; set; }
    }
}
