using Core.Entities;
using Core.Specifications;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data;

public class SpecificationEvaluator<TEntity> where TEntity : BaseEntity
{
    public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery, ISpecification<TEntity> spec)
    {
        var query = inputQuery;
        if (spec.Criteria != null)
        {
            query = query.Where(spec.Criteria); // Ex: p => p.ProductTypeId == id
        }

        // take include and aggregate them and pass them into a query which is going to be a IQueryable then we pass to our list or method
        // so that we can query the database and return the result based on what's contained in this IQueryable
        query = spec.Includes.Aggregate(query, (current, include) => current.Include(include));

        return query;
    }
}