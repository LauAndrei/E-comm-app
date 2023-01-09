using Core.Entities;

namespace Core.Interfaces;

/**
 * This is gonna look for a disposed method in our unit of work class
 * and when we've finished our transaction, is going to dispose of our context
 */
public interface IUnitOfWork : IDisposable
{
    IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;
    
    /**
     * This is gonna return the number of changes to our database
     */
    Task<int> Complete();
}