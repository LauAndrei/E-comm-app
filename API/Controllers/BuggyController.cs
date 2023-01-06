using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
   private readonly StoreContext _context;

   public BuggyController(StoreContext context)
   {
      _context = context;
   }

   [HttpGet("testauth")]
   [Authorize]
   public ActionResult<string> GetSecretText()
   {
      // the key part of this is this authorize attribute here
      // what we should be able to see now is that we shouldn't be able to
      // access it unless we're logged in with a user
      // logged in = we won't be able to access this unless we send 
      // a valid JWT token to our server that then passes the check
      // it's gonna validate the signature, it's gonna validate the issuer
      // and if those checks pass, then it's going to let the user see what's inside here
      return "secret stuff";
   }

   [HttpGet("notfound")]
   public ActionResult GetNotFoundRequest()
   {
      var thing = _context.Products.Find(42);
      if (thing == null)
      {
         return NotFound(new ApiResponse(404));
      }
      return Ok();
   }
   
   [HttpGet("servererror")]
   public ActionResult GetServerError()
   {
      var thing = _context.Products.Find(42);
      var thingToReturn = thing.ToString();
      return Ok();
   }
   
   [HttpGet("badrequest")]
   public ActionResult GetBadRequest()
   {
      return BadRequest(new ApiResponse(400));
   }
   
   [HttpGet("badrequest/{id}")]
   public ActionResult GetNotFoundRequest(int id)
   {
      return Ok();
   }
}