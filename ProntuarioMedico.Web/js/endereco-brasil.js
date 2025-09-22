// Estados e Cidades do Brasil (ordenados alfabeticamente)
const estadosBrasil = [
    { sigla: 'SP', nome: 'São Paulo' },
    { sigla: 'AC', nome: 'Acre' },
    { sigla: 'AL', nome: 'Alagoas' },
    { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' },
    { sigla: 'BA', nome: 'Bahia' },
    { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' },
    { sigla: 'ES', nome: 'Espírito Santo' },
    { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' },
    { sigla: 'MT', nome: 'Mato Grosso' },
    { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' },
    { sigla: 'PA', nome: 'Pará' },
    { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' },
    { sigla: 'PE', nome: 'Pernambuco' },
    { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' },
    { sigla: 'RN', nome: 'Rio Grande do Norte' },
    { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' },
    { sigla: 'RR', nome: 'Roraima' },
    { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SE', nome: 'Sergipe' },
    { sigla: 'TO', nome: 'Tocantins' }
];

const cidadesPorEstado = {
    'SP': [
        'São Paulo', 'Mauá', 'Americana', 'Araçatuba', 'Araraquara', 'Barueri', 'Bauru', 'Bragança Paulista',
        'Campinas', 'Carapicuíba', 'Diadema', 'Embu das Artes', 'Ferraz de Vasconcelos',
        'Franca', 'Francisco Morato', 'Guarujá', 'Guarulhos', 'Hortolândia',
        'Indaiatuba', 'Itapevi', 'Itaquaquecetuba', 'Itu', 'Jacareí', 'Jundiaí',
        'Limeira', 'Marília', 'Mogi das Cruzes', 'Osasco', 'Piracicaba',
        'Praia Grande', 'Presidente Prudente', 'Ribeirão Preto', 'Rio Claro',
        'Santa Bárbara d\'Oeste', 'Santo André', 'Santos', 'São Bernardo do Campo',
        'São Carlos', 'São José dos Campos', 'Sorocaba', 'Sumaré',
        'Suzano', 'Taboão da Serra', 'Taubaté'
    ],
    'RJ': [
        'Angra dos Reis', 'Barra Mansa', 'Belford Roxo', 'Cabo Frio', 'Campos dos Goytacazes',
        'Duque de Caxias', 'Itaboraí', 'Macaé', 'Magé', 'Mesquita', 'Nilópolis',
        'Niterói', 'Nova Friburgo', 'Nova Iguaçu', 'Petrópolis', 'Rio de Janeiro',
        'São Gonçalo', 'São João de Meriti', 'Teresópolis', 'Volta Redonda'
    ],
    'MG': [
        'Barbacena', 'Belo Horizonte', 'Betim', 'Contagem', 'Coronel Fabriciano',
        'Divinópolis', 'Governador Valadares', 'Ibirité', 'Ipatinga', 'Juiz de Fora',
        'Montes Claros', 'Patos de Minas', 'Poços de Caldas', 'Pouso Alegre',
        'Ribeirão das Neves', 'Sabará', 'Santa Luzia', 'Sete Lagoas', 'Teófilo Otoni',
        'Uberaba', 'Uberlândia', 'Vespasiano'
    ],
    'RS': [
        'Alvorada', 'Bagé', 'Bento Gonçalves', 'Cachoeirinha', 'Canoas', 'Caxias do Sul',
        'Erechim', 'Gravataí', 'Guaíba', 'Novo Hamburgo', 'Passo Fundo', 'Pelotas',
        'Porto Alegre', 'Rio Grande', 'Santa Cruz do Sul', 'Santa Maria', 'São Leopoldo',
        'Sapucaia do Sul', 'Uruguaiana', 'Viamão'
    ],
    'PR': [
        'Almirante Tamandaré', 'Apucarana', 'Arapongas', 'Araucária', 'Cambé',
        'Campo Largo', 'Cascavel', 'Colombo', 'Curitiba', 'Foz do Iguaçu',
        'Guarapuava', 'Londrina', 'Maringá', 'Paranaguá', 'Pinhais', 'Piraquara',
        'Ponta Grossa', 'São José dos Pinhais', 'Toledo', 'Umuarama'
    ],
    'BA': [
        'Alagoinhas', 'Camaçari', 'Candeias', 'Eunápolis', 'Feira de Santana',
        'Guanambi', 'Ilhéus', 'Itabuna', 'Jacobina', 'Jequié', 'Juazeiro',
        'Lauro de Freitas', 'Paulo Afonso', 'Porto Seguro', 'Salvador',
        'Senhor do Bonfim', 'Serrinha', 'Simões Filho', 'Teixeira de Freitas',
        'Vitória da Conquista'
    ],
    'SC': [
        'Florianópolis', 'Joinville', 'Blumenau', 'São José', 'Criciúma',
        'Chapecó', 'Itajaí', 'Lages', 'Jaraguá do Sul', 'Palhoça',
        'Balneário Camboriú', 'Brusque', 'Tubarão', 'São Bento do Sul',
        'Caçador', 'Camboriú', 'Navegantes', 'Concórdia', 'Rio do Sul',
        'Araranguá'
    ],
    'GO': [
        'Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia',
        'Águas Lindas de Goiás', 'Valparaíso de Goiás', 'Trindade', 'Formosa',
        'Novo Gama', 'Itumbiara', 'Senador Canedo', 'Catalão', 'Jataí',
        'Planaltina', 'Caldas Novas', 'Santo Antônio do Descoberto', 'Goianésia',
        'Cidade Ocidental', 'Mineiros'
    ],
    'PE': [
        'Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Bandeira', 'Caruaru',
        'Petrolina', 'Paulista', 'Cabo de Santo Agostinho', 'Camaragibe',
        'Garanhuns', 'Vitória de Santo Antão', 'Igarassu', 'São Lourenço da Mata',
        'Santa Cruz do Capibaribe', 'Abreu e Lima', 'Ipojuca', 'Serra Talhada',
        'Araripina', 'Gravatá', 'Carpina'
    ],
    'CE': [
        'Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral',
        'Crato', 'Itapipoca', 'Maranguape', 'Iguatu', 'Quixadá',
        'Canindé', 'Aquiraz', 'Pacatuba', 'Crateús', 'Russas',
        'Aracati', 'Cascavel', 'Pacajus', 'Icó', 'Horizonte'
    ],
    'PA': [
        'Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Parauapebas',
        'Castanhal', 'Abaetetuba', 'Cametá', 'Marituba', 'Breves',
        'Tucuruí', 'Bragança', 'Paragominas', 'Redenção', 'Altamira',
        'Itaituba', 'Salinópolis', 'Tailândia', 'Oriximiná', 'Barcarena'
    ],
    'DF': [
        'Brasília', 'Gama', 'Taguatinga', 'Ceilândia', 'Sobradinho',
        'Planaltina', 'São Sebastião', 'Recanto das Emas', 'Santa Maria',
        'Samambaia', 'Águas Claras', 'Riacho Fundo', 'Guará', 'Núcleo Bandeirante',
        'Cruzeiro', 'Lago Sul', 'Lago Norte', 'Candangolândia', 'Jardim Botânico',
        'Itapoã'
    ],
    'MA': [
        'São Luís', 'Imperatriz', 'São José de Ribamar', 'Timon', 'Caxias',
        'Codó', 'Paço do Lumiar', 'Açailândia', 'Bacabal', 'Balsas',
        'Santa Inês', 'Pinheiro', 'Pedreiras', 'Chapadinha', 'Santa Luzia',
        'Barra do Corda', 'Coelho Neto', 'Rosário', 'Presidente Dutra',
        'Viana'
    ],
    'PB': [
        'João Pessoa', 'Campina Grande', 'Santa Rita', 'Patos', 'Bayeux',
        'Sousa', 'Cajazeiras', 'Cabedelo', 'Guarabira', 'Mamanguape',
        'Sapé', 'Desterro', 'Rio Tinto', 'Esperança', 'Cruz do Espírito Santo',
        'Monteiro', 'Princesa Isabel', 'Areia', 'Itabaiana', 'Conde'
    ],
    'ES': [
        'Vitória', 'Cariacica', 'Serra', 'Vila Velha', 'Linhares',
        'Colatina', 'Guarapari', 'São Mateus', 'Cachoeiro de Itapemirim',
        'Aracruz', 'Viana', 'Nova Venécia', 'Barra de São Francisco',
        'Santa Teresa', 'Fundão', 'Anchieta', 'Alegre', 'Castelo',
        'Marataízes', 'Domingos Martins'
    ],
    'RN': [
        'Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante', 'Macaíba',
        'Ceará-Mirim', 'Caicó', 'Assu', 'Currais Novos', 'São José de Mipibu',
        'Santa Cruz', 'João Câmara', 'Nova Cruz', 'Touros', 'Canguaretama',
        'Extremoz', 'Areia Branca', 'Pau dos Ferros', 'São Paulo do Potengi',
        'Monte Alegre'
    ],
    'MT': [
        'Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Tangará da Serra',
        'Cáceres', 'Sorriso', 'Lucas do Rio Verde', 'Barra do Garças',
        'Primavera do Leste', 'Alta Floresta', 'Peixoto de Azevedo',
        'Nova Mutum', 'Mirassol d\'Oeste', 'Diamantino', 'Colíder',
        'Juína', 'Pontes e Lacerda', 'Água Boa', 'Guarantã do Norte'
    ],
    'MS': [
        'Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã',
        'Naviraí', 'Nova Andradina', 'Sidrolândia', 'Maracaju', 'São Gabriel do Oeste',
        'Coxim', 'Aquidauana', 'Paranaíba', 'Aparecida do Taboado', 'Jardim',
        'Chapadão do Sul', 'Amambai', 'Ribas do Rio Pardo', 'Ivinhema',
        'Cassilândia'
    ],
    'AL': [
        'Maceió', 'Arapiraca', 'Rio Largo', 'Palmeira dos Índios', 'União dos Palmares',
        'Penedo', 'Coruripe', 'Marechal Deodoro', 'São Miguel dos Campos',
        'Santana do Ipanema', 'Delmiro Gouveia', 'Pilar', 'Girau do Ponciano',
        'Viçosa', 'São Sebastião', 'Satuba', 'Campo Alegre', 'Murici',
        'Messias', 'São José da Laje'
    ],
    'PI': [
        'Teresina', 'Parnaíba', 'Picos', 'Piripiri', 'Floriano',
        'Campo Maior', 'Barras', 'União', 'Altos', 'Pedro II',
        'Oeiras', 'São Raimundo Nonato', 'Esperantina', 'Valença',
        'Bom Jesus', 'Amarante', 'Regeneração', 'Corrente', 'Simplício Mendes',
        'Água Branca'
    ],
    'SE': [
        'Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana',
        'São Cristóvão', 'Estância', 'Tobias Barreto', 'Simão Dias',
        'Propriá', 'Capela', 'Barra dos Coqueiros', 'Laranjeiras',
        'Canindé de São Francisco', 'Ribeirópolis', 'Umbaúba', 'Porto da Folha',
        'Poço Redondo', 'Neópolis', 'Nossa Senhora da Glória', 'Divina Pastora'
    ],
    'TO': [
        'Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional', 'Paraíso do Tocantins',
        'Colinas do Tocantins', 'Guaraí', 'Formoso do Araguaia', 'Tocantinópolis',
        'Miracema do Tocantins', 'Dianópolis', 'Araguatins', 'Pedro Afonso',
        'Xambioá', 'Alvorada', 'Taguatinga', 'Augustinópolis', 'Arraias',
        'Couto Magalhães', 'Filadélfia'
    ],
    'AC': [
        'Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá',
        'Feijó', 'Brasileia', 'Plácido de Castro', 'Xapuri', 'Senador Guiomard',
        'Epitaciolândia', 'Mâncio Lima', 'Bujari', 'Acrelândia', 'Porto Walter',
        'Rodrigues Alves', 'Capixaba', 'Assis Brasil', 'Santa Rosa do Purus',
        'Manoel Urbano', 'Marechal Thaumaturgo'
    ],
    'AP': [
        'Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque', 'Mazagão',
        'Porto Grande', 'Calçoene', 'Amapá', 'Ferreira Gomes', 'Pedra Branca do Amapari',
        'Vitória do Jari', 'Itaubal', 'Cutias', 'Pracuúba', 'Tartarugalzinho',
        'Serra do Navio'
    ],
    'AM': [
        'Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru', 'Coari',
        'Tefé', 'Tabatinga', 'Maués', 'São Gabriel da Cachoeira', 'Humaitá',
        'Lábrea', 'Iranduba', 'Barcelos', 'Presidente Figueiredo', 'Rio Preto da Eva',
        'Manicoré', 'Carauari', 'Eirunepé', 'Benjamin Constant', 'Novo Airão'
    ],
    'RO': [
        'Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena', 'Cacoal',
        'Rolim de Moura', 'Guajará-Mirim', 'Jaru', 'Ouro Preto do Oeste',
        'Machadinho d\'Oeste', 'Presidente Médici', 'Espigão d\'Oeste',
        'Colorado do Oeste', 'Cerejeiras', 'Pimenta Bueno', 'Buritis',
        'Nova Brasilândia d\'Oeste', 'Cujubim', 'Costa Marques', 'Alto Alegre dos Parecis'
    ],
    'RR': [
        'Boa Vista', 'Rorainópolis', 'Caracaraí', 'Alto Alegre', 'Mucajaí',
        'São Luiz', 'São João da Baliza', 'Bonfim', 'Cantá', 'Normandia',
        'Pacaraima', 'Iracema', 'Amajari', 'Caroebe', 'Uiramutã'
    ]
};

// Utility functions for address
const AddressUtils = {
    getEstados: () => estadosBrasil,
    
    getCidades: (estado) => {
        return cidadesPorEstado[estado] || [];
    },
    
    populateEstadoSelect: (selectElement, selectedValue = '') => {
        selectElement.innerHTML = '<option value="">Selecione o Estado</option>';
        
        estadosBrasil.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.sigla;
            option.textContent = `${estado.sigla} - ${estado.nome}`;
            
            if (estado.sigla === selectedValue) {
                option.selected = true;
            }
            
            selectElement.appendChild(option);
        });
    },
    
    populateCidadeSelect: (selectElement, estado, selectedValue = '') => {
        selectElement.innerHTML = '<option value="">Selecione a Cidade</option>';
        
        if (!estado) {
            selectElement.disabled = true;
            return;
        }
        
        selectElement.disabled = false;
        const cidades = cidadesPorEstado[estado] || [];
        
        cidades.forEach(cidade => {
            const option = document.createElement('option');
            option.value = cidade;
            option.textContent = cidade;
            
            if (cidade === selectedValue) {
                option.selected = true;
            }
            
            selectElement.appendChild(option);
        });
    },
    
    formatEnderecoCompleto: (rua, numero, complemento, bairro, cidade, estado) => {
        let endereco = '';
        
        if (rua) endereco += rua;
        if (numero) endereco += `, ${numero}`;
        if (complemento) endereco += `, ${complemento}`;
        if (bairro) endereco += ` - ${bairro}`;
        if (cidade) endereco += ` - ${cidade}`;
        if (estado) endereco += `/${estado}`;
        
        return endereco;
    }
};

// Export for use in other files
window.AddressUtils = AddressUtils;