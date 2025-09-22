using Microsoft.EntityFrameworkCore;
using ProntuarioMedico.Api.Models;

namespace ProntuarioMedico.Api.Data
{
    public class ProntuarioContext : DbContext
    {
        public ProntuarioContext(DbContextOptions<ProntuarioContext> options) : base(options)
        {
        }
        
        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<Prontuario> Prontuarios { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configurações para a entidade Paciente
            modelBuilder.Entity<Paciente>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Rua).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Numero).IsRequired().HasMaxLength(10);
                entity.Property(e => e.Complemento).HasMaxLength(50);
                entity.Property(e => e.Bairro).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Cidade).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Estado).IsRequired().HasMaxLength(2);
                entity.Property(e => e.DataCriacao).HasDefaultValueSql("datetime('now')");
                entity.Property(e => e.DataUltimaAtualizacao).HasDefaultValueSql("datetime('now')");
                
                // Índices para melhor performance
                entity.HasIndex(e => e.Nome);
                entity.HasIndex(e => e.Estado);
                entity.HasIndex(e => e.Cidade);
                entity.HasIndex(e => e.DataCriacao);
                
                // Relacionamento com Prontuarios
                entity.HasMany(p => p.Prontuarios)
                      .WithOne(pr => pr.Paciente)
                      .HasForeignKey(pr => pr.PacienteId)
                      .OnDelete(DeleteBehavior.Restrict); // Não permite deletar paciente com prontuários
            });
            
            // Configurações para a entidade Prontuario
            modelBuilder.Entity<Prontuario>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.PacienteId).IsRequired();
                entity.Property(e => e.FrequenciaAtividade).HasMaxLength(50);
                entity.Property(e => e.TempoAtividade).HasMaxLength(100);
                entity.Property(e => e.LocaisPraticaAtividade).HasMaxLength(200);
                entity.Property(e => e.ComoSoubeProjeto).HasMaxLength(200);
                entity.Property(e => e.TipoDeslocamento).HasMaxLength(100);
                entity.Property(e => e.OpiniaoHorarioAplicacao).HasMaxLength(200);
                entity.Property(e => e.HistoricoMedico).HasMaxLength(1000);
                entity.Property(e => e.EvolucaoSaude).HasMaxLength(1000);
                entity.Property(e => e.Pressao).HasMaxLength(50);
                entity.Property(e => e.Ausculta).HasMaxLength(500);
                entity.Property(e => e.Observacoes).HasMaxLength(1000);
                entity.Property(e => e.DataCriacao).HasDefaultValueSql("datetime('now')");
                entity.Property(e => e.DataUltimaAtualizacao).HasDefaultValueSql("datetime('now')");
                
                // Índices para melhor performance
                entity.HasIndex(e => e.PacienteId);
                entity.HasIndex(e => e.DataCriacao);
            });
        }
        
        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }
        
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return await base.SaveChangesAsync(cancellationToken);
        }
        
        private void UpdateTimestamps()
        {
            // Atualizar timestamps para Pacientes
            var pacienteEntries = ChangeTracker.Entries()
                .Where(e => e.Entity is Paciente && (e.State == EntityState.Added || e.State == EntityState.Modified));
            
            foreach (var entry in pacienteEntries)
            {
                if (entry.Entity is Paciente paciente)
                {
                    paciente.DataUltimaAtualizacao = DateTime.Now;
                    
                    if (entry.State == EntityState.Added)
                    {
                        paciente.DataCriacao = DateTime.Now;
                    }
                }
            }
            
            // Atualizar timestamps para Prontuários
            var prontuarioEntries = ChangeTracker.Entries()
                .Where(e => e.Entity is Prontuario && (e.State == EntityState.Added || e.State == EntityState.Modified));
            
            foreach (var entry in prontuarioEntries)
            {
                if (entry.Entity is Prontuario prontuario)
                {
                    prontuario.DataUltimaAtualizacao = DateTime.Now;
                    
                    if (entry.State == EntityState.Added)
                    {
                        prontuario.DataCriacao = DateTime.Now;
                    }
                }
            }
        }
    }
}