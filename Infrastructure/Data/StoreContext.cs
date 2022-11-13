using Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class StoreContext : DbContext
{
    public StoreContext(DbContextOptions<StoreContext> options) : base(options)
    {
    }
    
    // This allows us to access the products when we use our context and use some of the methods that are defined
    // inside the DB context that are gonna allow us to query those entities and retrieve the data from db
    public DbSet<Product> Products { get; set; } // Products will be the name of the table
}