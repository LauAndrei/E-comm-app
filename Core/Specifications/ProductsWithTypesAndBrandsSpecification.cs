using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications;

public class ProductsWithTypesAndBrandsSpecification : BaseSpecification<Product>
{
    public ProductsWithTypesAndBrandsSpecification()
    {
        AddInclude(x => x.ProductType);
        AddInclude(x => x.ProductBrand);
    }

    public ProductsWithTypesAndBrandsSpecification(int id) : base(p => p.Id == id) // to our base class we're passing our expression
    {
        AddInclude(x => x.ProductType);
        AddInclude(x => x.ProductBrand);
    }
}