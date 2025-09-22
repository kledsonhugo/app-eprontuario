using System.ComponentModel.DataAnnotations;

namespace ProntuarioMedico.Api.DTOs
{
    public class ProntuarioDto
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "ID do paciente é obrigatório")]
        public int PacienteId { get; set; }
        
        // Informações do paciente (apenas leitura)
        public string PacienteNome { get; set; } = string.Empty;
        public int PacienteIdade { get; set; }
        
        // Informações de Atividade Física
        [StringLength(50, ErrorMessage = "Frequência de atividade deve ter no máximo 50 caracteres")]
        public string FrequenciaAtividade { get; set; } = string.Empty;
        
        [StringLength(100, ErrorMessage = "Tempo de atividade deve ter no máximo 100 caracteres")]
        public string TempoAtividade { get; set; } = string.Empty;
        
        [StringLength(200, ErrorMessage = "Locais de prática deve ter no máximo 200 caracteres")]
        public string LocaisPraticaAtividade { get; set; } = string.Empty;
        
        [StringLength(200, ErrorMessage = "Como soube do projeto deve ter no máximo 200 caracteres")]
        public string ComoSoubeProjeto { get; set; } = string.Empty;
        
        [StringLength(100, ErrorMessage = "Tipo de deslocamento deve ter no máximo 100 caracteres")]
        public string TipoDeslocamento { get; set; } = string.Empty;
        
        [StringLength(200, ErrorMessage = "Opinião sobre horário deve ter no máximo 200 caracteres")]
        public string OpiniaoHorarioAplicacao { get; set; } = string.Empty;
        
        // Informações Médicas
        [StringLength(1000, ErrorMessage = "Histórico médico deve ter no máximo 1000 caracteres")]
        public string HistoricoMedico { get; set; } = string.Empty;
        
        [StringLength(1000, ErrorMessage = "Evolução de saúde deve ter no máximo 1000 caracteres")]
        public string EvolucaoSaude { get; set; } = string.Empty;
        
        [StringLength(50, ErrorMessage = "Pressão deve ter no máximo 50 caracteres")]
        public string Pressao { get; set; } = string.Empty;
        
        [StringLength(500, ErrorMessage = "Ausculta deve ter no máximo 500 caracteres")]
        public string Ausculta { get; set; } = string.Empty;
        
        [StringLength(1000, ErrorMessage = "Observações deve ter no máximo 1000 caracteres")]
        public string Observacoes { get; set; } = string.Empty;
        
        // Controle de data
        public DateTime DataCriacao { get; set; }
        public DateTime DataUltimaAtualizacao { get; set; }
    }
    
    public class CreateProntuarioDto
    {
        [Required(ErrorMessage = "ID do paciente é obrigatório")]
        public int PacienteId { get; set; }
        
        // Informações de Atividade Física
        [StringLength(50, ErrorMessage = "Frequência de atividade deve ter no máximo 50 caracteres")]
        public string FrequenciaAtividade { get; set; } = string.Empty;
        
        [StringLength(100, ErrorMessage = "Tempo de atividade deve ter no máximo 100 caracteres")]
        public string TempoAtividade { get; set; } = string.Empty;
        
        [StringLength(200, ErrorMessage = "Locais de prática deve ter no máximo 200 caracteres")]
        public string LocaisPraticaAtividade { get; set; } = string.Empty;
        
        [StringLength(200, ErrorMessage = "Como soube do projeto deve ter no máximo 200 caracteres")]
        public string ComoSoubeProjeto { get; set; } = string.Empty;
        
        [StringLength(100, ErrorMessage = "Tipo de deslocamento deve ter no máximo 100 caracteres")]
        public string TipoDeslocamento { get; set; } = string.Empty;
        
        [StringLength(200, ErrorMessage = "Opinião sobre horário deve ter no máximo 200 caracteres")]
        public string OpiniaoHorarioAplicacao { get; set; } = string.Empty;
        
        // Informações Médicas
        [StringLength(1000, ErrorMessage = "Histórico médico deve ter no máximo 1000 caracteres")]
        public string HistoricoMedico { get; set; } = string.Empty;
        
        [StringLength(1000, ErrorMessage = "Evolução de saúde deve ter no máximo 1000 caracteres")]
        public string EvolucaoSaude { get; set; } = string.Empty;
        
        [StringLength(50, ErrorMessage = "Pressão deve ter no máximo 50 caracteres")]
        public string Pressao { get; set; } = string.Empty;
        
        [StringLength(500, ErrorMessage = "Ausculta deve ter no máximo 500 caracteres")]
        public string Ausculta { get; set; } = string.Empty;
        
        [StringLength(1000, ErrorMessage = "Observações deve ter no máximo 1000 caracteres")]
        public string Observacoes { get; set; } = string.Empty;
    }
    
    public class UpdateProntuarioDto : CreateProntuarioDto
    {
        [Required]
        public int Id { get; set; }
    }
}