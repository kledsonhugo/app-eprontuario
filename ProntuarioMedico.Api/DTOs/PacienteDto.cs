using System.ComponentModel.DataAnnotations;

namespace ProntuarioMedico.Api.DTOs
{
    public class PacienteDto
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Idade é obrigatória")]
        [Range(0, 150, ErrorMessage = "Idade deve estar entre 0 e 150 anos")]
        public int Idade { get; set; }
        
        [Required(ErrorMessage = "Data de nascimento é obrigatória")]
        public DateTime DataNascimento { get; set; }
        
        // Endereço detalhado
        [Required(ErrorMessage = "CEP é obrigatório")]
        [StringLength(9, ErrorMessage = "CEP deve ter no máximo 9 caracteres")]
        public string Cep { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Rua é obrigatória")]
        [StringLength(150, ErrorMessage = "Rua deve ter no máximo 150 caracteres")]
        public string Rua { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Número é obrigatório")]
        [StringLength(10, ErrorMessage = "Número deve ter no máximo 10 caracteres")]
        public string Numero { get; set; } = string.Empty;
        
        [StringLength(50, ErrorMessage = "Complemento deve ter no máximo 50 caracteres")]
        public string Complemento { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Bairro é obrigatório")]
        [StringLength(50, ErrorMessage = "Bairro deve ter no máximo 50 caracteres")]
        public string Bairro { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Cidade é obrigatória")]
        [StringLength(50, ErrorMessage = "Cidade deve ter no máximo 50 caracteres")]
        public string Cidade { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Estado é obrigatório")]
        [StringLength(2, ErrorMessage = "Estado deve ter 2 caracteres")]
        public string Estado { get; set; } = string.Empty;
        
        // Controle de data
        public DateTime DataCriacao { get; set; }
        public DateTime DataUltimaAtualizacao { get; set; }
    }
    
    public class CreatePacienteDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Idade é obrigatória")]
        [Range(0, 150, ErrorMessage = "Idade deve estar entre 0 e 150 anos")]
        public int Idade { get; set; }
        
        [Required(ErrorMessage = "Data de nascimento é obrigatória")]
        public DateTime DataNascimento { get; set; }
        
        // Endereço detalhado
        [Required(ErrorMessage = "CEP é obrigatório")]
        [StringLength(9, ErrorMessage = "CEP deve ter no máximo 9 caracteres")]
        public string Cep { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Rua é obrigatória")]
        [StringLength(150, ErrorMessage = "Rua deve ter no máximo 150 caracteres")]
        public string Rua { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Número é obrigatório")]
        [StringLength(10, ErrorMessage = "Número deve ter no máximo 10 caracteres")]
        public string Numero { get; set; } = string.Empty;
        
        [StringLength(50, ErrorMessage = "Complemento deve ter no máximo 50 caracteres")]
        public string Complemento { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Bairro é obrigatório")]
        [StringLength(50, ErrorMessage = "Bairro deve ter no máximo 50 caracteres")]
        public string Bairro { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Cidade é obrigatória")]
        [StringLength(50, ErrorMessage = "Cidade deve ter no máximo 50 caracteres")]
        public string Cidade { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Estado é obrigatório")]
        [StringLength(2, ErrorMessage = "Estado deve ter 2 caracteres")]
        public string Estado { get; set; } = string.Empty;
    }
    
    public class UpdatePacienteDto : CreatePacienteDto
    {
        [Required]
        public int Id { get; set; }
    }
}