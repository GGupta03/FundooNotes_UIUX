using DataBaseLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace DataBaseLayer.FundooDbContext
{
    public class FundooNotesDbContext : DbContext
    {
        public FundooNotesDbContext(DbContextOptions<FundooNotesDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ---------------- NOTE ↔ LABEL (Many-to-Many) ----------------
            modelBuilder.Entity<NoteLabel>()
                .HasOne(nl => nl.Note)
                .WithMany(n => n.NoteLabels)
                .HasForeignKey(nl => nl.NoteId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<NoteLabel>()
                .HasOne(nl => nl.Label)
                .WithMany(l => l.NoteLabels)
                .HasForeignKey(nl => nl.LabelId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------- NOTE ↔ COLLABORATOR ----------------
            modelBuilder.Entity<Collaborator>()
                .HasOne(c => c.Note)
                .WithMany()
                .HasForeignKey(c => c.NoteId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------- OWNER USER ----------------
            modelBuilder.Entity<Collaborator>()
                .HasOne(c => c.Owner)
                .WithMany()
                .HasForeignKey(c => c.OwnerUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // ---------------- COLLABORATOR USER ----------------
            modelBuilder.Entity<Collaborator>()
                .HasOne(c => c.CollaboratorUser)
                .WithMany()
                .HasForeignKey(c => c.CollaboratorUserId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<Label> Labels { get; set; }
        public DbSet<NoteLabel> NoteLabels { get; set; }
        public DbSet<Collaborator> Collaborators { get; set; }
    }
}
