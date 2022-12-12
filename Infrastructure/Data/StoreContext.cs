﻿using System.Reflection;
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
    public DbSet<ProductBrand> ProductBrands { get; set; }
    public DbSet<ProductType> ProductTypes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // Sql Lite does not support decimal type, so we do this to convert all properties from decimal type to double
        if (Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
        { 
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var properties = entityType.ClrType.GetProperties().Where(p => p.PropertyType == typeof(decimal));
                foreach (var property in properties)
                {
                    modelBuilder.Entity(entityType.Name).Property(property.Name).HasConversion<double>();
                }
            }
        }
    }
}