using System.Collections;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly StoreContext _context;
    
    /**
     * Any repositories that we use here is going to be stored
     * inside this HashTable
     */
    private Hashtable _repositories;

    public UnitOfWork(StoreContext context)
    {
        _context = context;
    }
    
    public void Dispose()
    {
        _context.Dispose();
    }

    public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
    {
        if(_repositories == null)
        {
            _repositories = new Hashtable();
        }

        var type = typeof(TEntity).Name;
        
        // checks if we don't have a repository already for this particular type
        if (!_repositories.ContainsKey(type))
        {
            // create a repository type of generic repository
            var repositoryType = typeof(GenericRepository<>);
            // rather than using or creating an instance of our context, when we create our repository instance, we're
            // going to be passing in the context that our unit of work owns as a parameter into that repository
            // that we're creating there
            var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _context);
            
            // add repository to hashtable
            _repositories.Add(type, repositoryInstance);
        }

        return (IGenericRepository<TEntity>)_repositories[type];
    }

    public async Task<int> Complete()
    {
        return await _context.SaveChangesAsync();
    }
}