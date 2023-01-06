using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity;

public class AppIdentityDbContextSeed
{
    public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
    {
        if (!userManager.Users.Any())
        {
            var user = new AppUser
            {
                DisplayName = "Bob",
                Email = "bob@test.com",
                UserName = "bob@test.com",
                Address = new Address
                {
                    FirstName = "Bob",
                    LastName = "Pop",
                    Street = "Smecheriei 17",
                    City = "Ploiesti",
                    State = "Prahova",
                    ZipCode = "90210"
                }
            };

            await userManager.CreateAsync(user, "Pa$$w0rd");
        }
    }
}