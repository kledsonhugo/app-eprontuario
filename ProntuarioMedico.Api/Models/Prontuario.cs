using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProntuarioMedico.Api.Models
{
    public class Prontuario
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [ForeignKey("Paciente")]
        public int PacienteId { get; set; }
        
        // Navegação para o paciente
        public virtual Paciente Paciente { get; set; } = null!;
        
        // Informações de Atividade Física
        [StringLength(50)]
        public string FrequenciaAtividade { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string TempoAtividade { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string LocaisPraticaAtividade { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string ComoSoubeProjeto { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string TipoDeslocamento { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string OpiniaoHorarioAplicacao { get; set; } = string.Empty;
        
        // Informações Médicas
        [StringLength(1000)]
        public string HistoricoMedico { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string EvolucaoSaude { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string Pressao { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Ausculta { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string Observacoes { get; set; } = string.Empty;
        
        // Controle de data
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        public DateTime DataUltimaAtualizacao { get; set; } = DateTime.Now;
    }
}