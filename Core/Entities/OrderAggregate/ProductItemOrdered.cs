namespace Core.Entities.OrderAggregate;

/**
    this is just gonna act as a snapshot of our order at the time
    or our productItem at the item is was placed just based on the fact
    that the product name might change, the product image might change
    but we wouldn't want to change it as well in our order so we don't
    want a relation between our order and our product item;
    We're gonna store the values as it was when it was ordered into
    our database.
    This is not going to have an id because it's going to be owned
    by the order itself
 */
public class ProductItemOrdered
{
    public int ProductItemId { get; set; }
    public string ProductName { get; set; }
    public string PictureUrl { get; set; }

    public ProductItemOrdered()
    {
        
    }

    public ProductItemOrdered(int productItemId, string productName, string pictureUrl)
    {
        ProductItemId = productItemId;
        ProductName = productName;
        PictureUrl = pictureUrl;
    }
}