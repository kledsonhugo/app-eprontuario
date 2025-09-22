using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProntuarioMedico.Api.Data;
using ProntuarioMedico.Api.DTOs;
using ProntuarioMedico.Api.Models;

namespace ProntuarioMedico.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PacientesController : ControllerBase
    {
        private readonly ProntuarioContext _context;
        private readonly ILogger<PacientesController> _logger;

        public PacientesController(ProntuarioContext context, ILogger<PacientesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Pacientes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PacienteDto>>> GetPacientes()
        {
            try
            {
                var pacientes = await _context.Pacientes
                    .OrderByDescending(p => p.DataCriacao)
                    .ToListAsync();

                var pacientesDto = pacientes.Select(p => MapToDto(p)).ToList();
                
                return Ok(pacientesDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar pacientes");
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        // GET: api/Pacientes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PacienteDto>> GetPaciente(int id)
        {
            try
            {
                var paciente = await _context.Pacientes.FindAsync(id);

                if (paciente == null)
                {
                    return NotFound($"Paciente com ID {id} não encontrado");
                }

                return Ok(MapToDto(paciente));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar paciente com ID {Id}", id);
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        // POST: api/Pacientes
        [HttpPost]
        public async Task<ActionResult<PacienteDto>> PostPaciente(CreatePacienteDto createPacienteDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var paciente = MapFromCreateDto(createPacienteDto);
                
                _context.Pacientes.Add(paciente);
                await _context.SaveChangesAsync();

                var pacienteDto = MapToDto(paciente);
                
                return CreatedAtAction(nameof(GetPaciente), new { id = paciente.Id }, pacienteDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar paciente");
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        // PUT: api/Pacientes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaciente(int id, UpdatePacienteDto updatePacienteDto)
        {
            try
            {
                if (id != updatePacienteDto.Id)
                {
                    return BadRequest("ID do paciente não corresponde ao ID da URL");
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var paciente = await _context.Pacientes.FindAsync(id);
                if (paciente == null)
                {
                    return NotFound($"Paciente com ID {id} não encontrado");
                }

                // Atualizar propriedades
                UpdatePacienteFromDto(paciente, updatePacienteDto);

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PacienteExists(id))
                    {
                        return NotFound();
                    }
                    throw;
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao atualizar paciente com ID {Id}", id);
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        // DELETE: api/Pacientes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaciente(int id)
        {
            try
            {
                var paciente = await _context.Pacientes.FindAsync(id);
                if (paciente == null)
                {
                    return NotFound($"Paciente com ID {id} não encontrado");
                }

                // Verificar se o paciente possui prontuários
                var hasProntuarios = await _context.Prontuarios.AnyAsync(p => p.PacienteId == id);
                if (hasProntuarios)
                {
                    return BadRequest("Não é possível excluir o paciente pois existem prontuários associados a ele. Exclua primeiro os prontuários.");
                }

                _context.Pacientes.Remove(paciente);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao excluir paciente com ID {Id}", id);
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        // GET: api/Pacientes/search?termo=João
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<PacienteDto>>> SearchPacientes(string termo)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(termo))
                {
                    return await GetPacientes();
                }

                var pacientes = await _context.Pacientes
                    .Where(p => p.Nome.Contains(termo) || 
                               p.Rua.Contains(termo) || 
                               p.Bairro.Contains(termo) ||
                               p.Cidade.Contains(termo))
                    .OrderByDescending(p => p.DataCriacao)
                    .ToListAsync();

                var pacientesDto = pacientes.Select(p => MapToDto(p)).ToList();
                
                return Ok(pacientesDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar pacientes com termo {Termo}", termo);
                return StatusCode(500, "Erro interno do servidor");
            }
        }

        private bool PacienteExists(int id)
        {
            return _context.Pacientes.Any(e => e.Id == id);
        }

        private static PacienteDto MapToDto(Paciente paciente)
        {
            return new PacienteDto
            {
                Id = paciente.Id,
                Nome = paciente.Nome,
                Idade = paciente.Idade,
                DataNascimento = paciente.DataNascimento,
                Cep = paciente.Cep,
                Rua = paciente.Rua,
                Numero = paciente.Numero,
                Complemento = paciente.Complemento,
                Bairro = paciente.Bairro,
                Cidade = paciente.Cidade,
                Estado = paciente.Estado,
                DataCriacao = paciente.DataCriacao,
                DataUltimaAtualizacao = paciente.DataUltimaAtualizacao
            };
        }

        private static Paciente MapFromCreateDto(CreatePacienteDto dto)
        {
            return new Paciente
            {
                Nome = dto.Nome,
                Idade = dto.Idade,
                DataNascimento = dto.DataNascimento,
                Cep = dto.Cep,
                Rua = dto.Rua,
                Numero = dto.Numero,
                Complemento = dto.Complemento,
                Bairro = dto.Bairro,
                Cidade = dto.Cidade,
                Estado = dto.Estado
            };
        }

        private static void UpdatePacienteFromDto(Paciente paciente, UpdatePacienteDto dto)
        {
            paciente.Nome = dto.Nome;
            paciente.Idade = dto.Idade;
            paciente.DataNascimento = dto.DataNascimento;
            paciente.Cep = dto.Cep;
            paciente.Rua = dto.Rua;
            paciente.Numero = dto.Numero;
            paciente.Complemento = dto.Complemento;
            paciente.Bairro = dto.Bairro;
            paciente.Cidade = dto.Cidade;
            paciente.Estado = dto.Estado;
        }
    }
}