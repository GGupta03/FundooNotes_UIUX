using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataBaseLayer.FundooDbContext
{
    public class FundooNotesDbContextFactory
        : IDesignTimeDbContextFactory<FundooNotesDbContext>
    {
        public FundooNotesDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<FundooNotesDbContext>();

            optionsBuilder.UseSqlServer(
                "Server=GAURAVPC\\SQLEXPRESS;Database=FundooNotesDb;Trusted_Connection=True;TrustServerCertificate=True;"
            );

            return new FundooNotesDbContext(optionsBuilder.Options);
        }
    }
}
