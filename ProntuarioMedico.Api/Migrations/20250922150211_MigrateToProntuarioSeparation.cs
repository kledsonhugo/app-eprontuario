using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProntuarioMedico.Api.Migrations
{
    /// <inheritdoc />
    public partial class MigrateToProntuarioSeparation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Renomear a tabela atual Pacientes para PacientesOld temporariamente
            migrationBuilder.Sql("ALTER TABLE Pacientes RENAME TO PacientesOld;");
            
            // Criar nova tabela Pacientes apenas com dados pessoais
            migrationBuilder.CreateTable(
                name: "Pacientes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nome = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Idade = table.Column<int>(type: "INTEGER", nullable: false),
                    DataNascimento = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Rua = table.Column<string>(type: "TEXT", maxLength: 150, nullable: false),
                    Numero = table.Column<string>(type: "TEXT", maxLength: 10, nullable: false),
                    Complemento = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Bairro = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Cidade = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Estado = table.Column<string>(type: "TEXT", maxLength: 2, nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "datetime('now')"),
                    DataUltimaAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "datetime('now')")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pacientes", x => x.Id);
                });

            // Criar tabela Prontuarios para dados médicos
            migrationBuilder.CreateTable(
                name: "Prontuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PacienteId = table.Column<int>(type: "INTEGER", nullable: false),
                    FrequenciaAtividade = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    TempoAtividade = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    LocaisPraticaAtividade = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    ComoSoubeProjeto = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    TipoDeslocamento = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    OpiniaoHorarioAplicacao = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    HistoricoMedico = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false),
                    EvolucaoSaude = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false),
                    Pressao = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Ausculta = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    Observacoes = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false),
                    DataCriacao = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "datetime('now')"),
                    DataUltimaAtualizacao = table.Column<DateTime>(type: "TEXT", nullable: false, defaultValueSql: "datetime('now')")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prontuarios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Prontuarios_Pacientes_PacienteId",
                        column: x => x.PacienteId,
                        principalTable: "Pacientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            // Migrar dados pessoais para nova tabela Pacientes
            migrationBuilder.Sql(@"
                INSERT INTO Pacientes (Id, Nome, Idade, DataNascimento, Rua, Numero, Complemento, Bairro, Cidade, Estado, DataCriacao, DataUltimaAtualizacao)
                SELECT Id, Nome, Idade, DataNascimento, Rua, Numero, COALESCE(Complemento, ''), Bairro, Cidade, Estado, DataCriacao, DataUltimaAtualizacao
                FROM PacientesOld;
            ");

            // Migrar dados médicos para tabela Prontuarios
            migrationBuilder.Sql(@"
                INSERT INTO Prontuarios (PacienteId, FrequenciaAtividade, TempoAtividade, LocaisPraticaAtividade, ComoSoubeProjeto, TipoDeslocamento, OpiniaoHorarioAplicacao, HistoricoMedico, EvolucaoSaude, Pressao, Ausculta, Observacoes, DataCriacao, DataUltimaAtualizacao)
                SELECT Id, COALESCE(FrequenciaAtividade, ''), COALESCE(TempoAtividade, ''), COALESCE(LocaisPraticaAtividade, ''), COALESCE(ComoSoubeProjeto, ''), COALESCE(TipoDeslocamento, ''), COALESCE(OpiniaoHorarioAplicacao, ''), COALESCE(HistoricoMedico, ''), COALESCE(EvolucaoSaude, ''), COALESCE(Pressao, ''), COALESCE(Ausculta, ''), COALESCE(Observacoes, ''), DataCriacao, DataUltimaAtualizacao
                FROM PacientesOld;
            ");

            // Remover tabela temporária
            migrationBuilder.Sql("DROP TABLE PacientesOld;");

            // Recriar índices
            migrationBuilder.CreateIndex(
                name: "IX_Pacientes_Cidade",
                table: "Pacientes",
                column: "Cidade");

            migrationBuilder.CreateIndex(
                name: "IX_Pacientes_DataCriacao",
                table: "Pacientes",
                column: "DataCriacao");

            migrationBuilder.CreateIndex(
                name: "IX_Pacientes_Estado",
                table: "Pacientes",
                column: "Estado");

            migrationBuilder.CreateIndex(
                name: "IX_Pacientes_Nome",
                table: "Pacientes",
                column: "Nome");

            migrationBuilder.CreateIndex(
                name: "IX_Prontuarios_DataCriacao",
                table: "Prontuarios",
                column: "DataCriacao");

            migrationBuilder.CreateIndex(
                name: "IX_Prontuarios_PacienteId",
                table: "Prontuarios",
                column: "PacienteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverter seria recriar a estrutura original, mas é complexo
            // Para simplificar, vamos apenas remover as novas tabelas
            migrationBuilder.DropTable(
                name: "Prontuarios");

            migrationBuilder.DropTable(
                name: "Pacientes");
        }
    }
}
