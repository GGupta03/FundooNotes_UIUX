using BusinessLayer.Interfaces;
using DataBaseLayer.Entities;
using DataBaseLayer.Repositories.Interfaces;
using ModelLayer.DTOs.Auth;
using ModelLayer.Helpers;   // ✅ REQUIRED


namespace BusinessLayer.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly JwtHelper _jwtHelper;
        private readonly IEmailService _emailService;

        public AuthService(
            IUserRepository userRepo,
            JwtHelper jwtHelper,
            IEmailService emailService)
        {
            _userRepo = userRepo;
            _jwtHelper = jwtHelper;
            _emailService = emailService;
        }

        // ---------------- REGISTER ----------------
        public async Task RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _userRepo.GetByEmailAsync(dto.Email);
            if (existingUser != null)
                throw new Exception("User already exists");

            var otp = GenerateOtp();

            // ✅ Create temporary user for OTP verification only
            // User will be fully registered only after email verification
            var tempUser = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = PasswordHasher.Hash(dto.Password),
                IsEmailVerified = false,
                Otp = otp,
                OtpExpiry = DateTime.UtcNow.AddMinutes(5),
                OtpPurpose = "REGISTER"
            };

            // ✅ Store temporary user (will be verified later)
            await _userRepo.AddAsync(tempUser);
            await _emailService.SendOtpAsync(dto.Email, otp);
        }
        public async Task LoginAsync(LoginDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email);

            if (user == null || !PasswordHasher.Verify(dto.Password, user.PasswordHash))
                throw new Exception("Invalid credentials");

            if (!user.IsEmailVerified)
                throw new Exception("Email not verified");

            var otp = GenerateOtp();

            user.Otp = otp;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(5);
            user.OtpPurpose = "LOGIN"; // ✅

            await _userRepo.UpdateAsync(user);
            await _emailService.SendOtpAsync(user.Email, otp);
        }



        // ---------------- VERIFY OTP ----------------
        public async Task<string?> VerifyOtpAsync(VerifyOtpDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email);
            if (user == null)
                throw new Exception("User not found");

            if (user.Otp != dto.Otp ||
                user.OtpExpiry < DateTime.UtcNow ||
                user.OtpPurpose != dto.Purpose.ToUpper())
                throw new Exception("Invalid or expired OTP");

            // clear OTP
            user.Otp = null;
            user.OtpExpiry = null;
            user.OtpPurpose = null;

            if (dto.Purpose.ToUpper() == "REGISTER")
            {
                // ✅ EMAIL VERIFICATION REQUIRED: User is now fully registered
                user.IsEmailVerified = true;
                await _userRepo.UpdateAsync(user);
                return null; // Registration complete, user is now registered
            }

            if (dto.Purpose.ToUpper() == "LOGIN")
            {
                await _userRepo.UpdateAsync(user);
                return _jwtHelper.GenerateToken(user.Id, user.Email);
            }

            throw new Exception("Invalid OTP purpose");
        }

        // ---------------- FORGOT PASSWORD ----------------
        public async Task ForgotPasswordAsync(ForgotPasswordDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email);
            if (user == null)
                throw new Exception("User not found");

            var otp = GenerateOtp();

            user.Otp = otp;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(5);

            await _userRepo.UpdateAsync(user);
            await _emailService.SendOtpAsync(dto.Email, otp);
        }

        // ---------------- RESET PASSWORD ----------------
        public async Task ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email);
            if (user == null)
                throw new Exception("User not found");

            if (user.Otp != dto.Otp || user.OtpExpiry < DateTime.UtcNow)
                throw new Exception("Invalid or expired OTP");

            user.PasswordHash = PasswordHasher.Hash(dto.NewPassword);
            user.Otp = null;
            user.OtpExpiry = null;

            await _userRepo.UpdateAsync(user);
        }

        private string GenerateOtp()
        {
            return new Random().Next(100000, 999999).ToString();
        }
    }
}
