using System.ComponentModel.DataAnnotations;

namespace ProntuarioMedico.Api.Models
{
    public class Paciente
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;
        
        [Required]
        public int Idade { get; set; }
        
        [Required]
        public DateTime DataNascimento { get; set; }
        
        // Endereço detalhado
        [Required]
        [StringLength(9)]
        public string Cep { get; set; } = string.Empty;
        
        [Required]
        [StringLength(150)]
        public string Rua { get; set; } = string.Empty;
        
        [Required]
        [StringLength(10)]
        public string Numero { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string Complemento { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Bairro { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Cidade { get; set; } = string.Empty;
        
        [Required]
        [StringLength(2)]
        public string Estado { get; set; } = string.Empty;
        
        // Navegação para prontuários
        public virtual ICollection<Prontuario> Prontuarios { get; set; } = new List<Prontuario>();
        
        // Controle de data
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        public DateTime DataUltimaAtualizacao { get; set; } = DateTime.Now;
    }
}