using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProntuarioMedico.Api.Data;
using ProntuarioMedico.Api.Models;
using ProntuarioMedico.Api.DTOs;

namespace ProntuarioMedico.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProntuariosController : ControllerBase
    {
        private readonly ProntuarioContext _context;

        public ProntuariosController(ProntuarioContext context)
        {
            _context = context;
        }

        // GET: api/prontuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProntuarios()
        {
            var prontuarios = await _context.Prontuarios
                .Include(p => p.Paciente)
                .Select(p => new
                {
                    p.Id,
                    p.PacienteId,
                    PacienteNome = p.Paciente.Nome,
                    PacienteIdade = p.Paciente.Idade,
                    p.FrequenciaAtividade,
                    p.TempoAtividade,
                    p.LocaisPraticaAtividade,
                    p.ComoSoubeProjeto,
                    p.TipoDeslocamento,
                    p.OpiniaoHorarioAplicacao,
                    p.HistoricoMedico,
                    p.EvolucaoSaude,
                    p.Pressao,
                    p.Ausculta,
                    p.Observacoes,
                    p.DataCriacao,
                    p.DataUltimaAtualizacao
                })
                .OrderByDescending(p => p.DataCriacao)
                .ToListAsync();

            return Ok(prontuarios);
        }

        // GET: api/prontuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetProntuario(int id)
        {
            var prontuario = await _context.Prontuarios
                .Include(p => p.Paciente)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.PacienteId,
                    PacienteNome = p.Paciente.Nome,
                    Paciente = new
                    {
                        p.Paciente.Id,
                        p.Paciente.Nome,
                        p.Paciente.Idade,
                        p.Paciente.DataNascimento,
                        p.Paciente.Rua,
                        p.Paciente.Numero,
                        p.Paciente.Complemento,
                        p.Paciente.Bairro,
                        p.Paciente.Cidade,
                        p.Paciente.Estado
                    },
                    p.FrequenciaAtividade,
                    p.TempoAtividade,
                    p.LocaisPraticaAtividade,
                    p.ComoSoubeProjeto,
                    p.TipoDeslocamento,
                    p.OpiniaoHorarioAplicacao,
                    p.HistoricoMedico,
                    p.EvolucaoSaude,
                    p.Pressao,
                    p.Ausculta,
                    p.Observacoes,
                    p.DataCriacao,
                    p.DataUltimaAtualizacao
                })
                .FirstOrDefaultAsync();

            if (prontuario == null)
            {
                return NotFound();
            }

            return Ok(prontuario);
        }

        // GET: api/prontuarios/paciente/5
        [HttpGet("paciente/{pacienteId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetProntuariosByPaciente(int pacienteId)
        {
            // Verificar se o paciente existe
            var pacienteExists = await _context.Pacientes.AnyAsync(p => p.Id == pacienteId);
            if (!pacienteExists)
            {
                return NotFound($"Paciente com ID {pacienteId} não encontrado.");
            }

            var prontuarios = await _context.Prontuarios
                .Include(p => p.Paciente)
                .Where(p => p.PacienteId == pacienteId)
                .Select(p => new
                {
                    p.Id,
                    p.PacienteId,
                    PacienteNome = p.Paciente.Nome,
                    p.FrequenciaAtividade,
                    p.TempoAtividade,
                    p.LocaisPraticaAtividade,
                    p.ComoSoubeProjeto,
                    p.TipoDeslocamento,
                    p.OpiniaoHorarioAplicacao,
                    p.HistoricoMedico,
                    p.EvolucaoSaude,
                    p.Pressao,
                    p.Ausculta,
                    p.Observacoes,
                    p.DataCriacao,
                    p.DataUltimaAtualizacao
                })
                .OrderByDescending(p => p.DataCriacao)
                .ToListAsync();

            return Ok(prontuarios);
        }

        // POST: api/prontuarios
        [HttpPost]
        public async Task<ActionResult<Prontuario>> PostProntuario(CreateProntuarioDto createDto)
        {
            // Verificar se o paciente existe
            var pacienteExists = await _context.Pacientes.AnyAsync(p => p.Id == createDto.PacienteId);
            if (!pacienteExists)
            {
                return BadRequest($"Paciente com ID {createDto.PacienteId} não encontrado.");
            }

            var prontuario = new Prontuario
            {
                PacienteId = createDto.PacienteId,
                FrequenciaAtividade = createDto.FrequenciaAtividade,
                TempoAtividade = createDto.TempoAtividade,
                LocaisPraticaAtividade = createDto.LocaisPraticaAtividade,
                ComoSoubeProjeto = createDto.ComoSoubeProjeto,
                TipoDeslocamento = createDto.TipoDeslocamento,
                OpiniaoHorarioAplicacao = createDto.OpiniaoHorarioAplicacao,
                HistoricoMedico = createDto.HistoricoMedico,
                EvolucaoSaude = createDto.EvolucaoSaude,
                Pressao = createDto.Pressao,
                Ausculta = createDto.Ausculta,
                Observacoes = createDto.Observacoes
            };

            _context.Prontuarios.Add(prontuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProntuario", new { id = prontuario.Id }, prontuario);
        }

        // PUT: api/prontuarios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProntuario(int id, UpdateProntuarioDto updateDto)
        {
            if (id != updateDto.Id)
            {
                return BadRequest();
            }

            // Verificar se o prontuário existe
            var prontuario = await _context.Prontuarios.FindAsync(id);
            if (prontuario == null)
            {
                return NotFound();
            }

            // Verificar se o paciente existe
            var pacienteExists = await _context.Pacientes.AnyAsync(p => p.Id == updateDto.PacienteId);
            if (!pacienteExists)
            {
                return BadRequest($"Paciente com ID {updateDto.PacienteId} não encontrado.");
            }

            // Atualizar campos
            prontuario.PacienteId = updateDto.PacienteId;
            prontuario.FrequenciaAtividade = updateDto.FrequenciaAtividade;
            prontuario.TempoAtividade = updateDto.TempoAtividade;
            prontuario.LocaisPraticaAtividade = updateDto.LocaisPraticaAtividade;
            prontuario.ComoSoubeProjeto = updateDto.ComoSoubeProjeto;
            prontuario.TipoDeslocamento = updateDto.TipoDeslocamento;
            prontuario.OpiniaoHorarioAplicacao = updateDto.OpiniaoHorarioAplicacao;
            prontuario.HistoricoMedico = updateDto.HistoricoMedico;
            prontuario.EvolucaoSaude = updateDto.EvolucaoSaude;
            prontuario.Pressao = updateDto.Pressao;
            prontuario.Ausculta = updateDto.Ausculta;
            prontuario.Observacoes = updateDto.Observacoes;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProntuarioExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/prontuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProntuario(int id)
        {
            var prontuario = await _context.Prontuarios.FindAsync(id);
            if (prontuario == null)
            {
                return NotFound();
            }

            _context.Prontuarios.Remove(prontuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProntuarioExists(int id)
        {
            return _context.Prontuarios.Any(e => e.Id == id);
        }
    }
}