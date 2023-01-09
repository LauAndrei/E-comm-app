using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Config;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.OwnsOne(o => o.ShipToAddress, 
            a =>
            {
                a.WithOwner();
            });
        
        builder.Property(s => s.Status).HasConversion(
            o => o.ToString(),
            o => (OrderStatus) Enum.Parse(typeof(OrderStatus), o)
            );

        /*
         * this ensures that when we delete an order it also deletes the related order items at the same time
         */
        builder.HasMany(o => o.OrderItems).WithOne().OnDelete(DeleteBehavior.Cascade);
    }
}