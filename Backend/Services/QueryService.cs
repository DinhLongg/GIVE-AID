using Give_AID.API.Data;
using Give_AID.API.DTOs;
using Give_AID.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Give_AID.API.Services
{
    public class QueryService
    {
        private readonly GiveAidContext _context;
        public QueryService(GiveAidContext context) { _context = context; }

        public async Task<Query> CreateAsync(QueryRequest req)
        {
            var q = new Query
            {
                UserId = req.UserId,
                Subject = req.Subject,
                Message = req.Message
            };
            _context.Queries.Add(q);
            await _context.SaveChangesAsync();
            return q;
        }

        public async Task<List<Query>> GetAllAsync()
        {
            return await _context.Queries.Include(q => q.User).ToListAsync();
        }

        public async Task<bool> ReplyAsync(int id, string reply)
        {
            var q = await _context.Queries.FindAsync(id);
            if (q == null) return false;
            q.AdminReply = reply;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
