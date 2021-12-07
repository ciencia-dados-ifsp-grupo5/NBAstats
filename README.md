# NBAstats

Criação de modelos de aprendizado de máquina para predição salarial de jogadores
de basquete da NBA baseado em suas estatísticas por temporada.

Treinamento de modelos, criação de aplicação e infra-estrutura de produção
utilizando ambiente em nuvem.

Projeto interdisciplinar do segundo período do curso de Especialização em
Ciência de Dados do IFSP Campinas.

## Alunos:

- Daniel Vargas Shimamoto
- Diego Machado de Assis

## Artefatos produzidos

- Notebooks
  - [Análise de dados principal](./notebooks/NBAstats_data_analysis.ipynb)
  - [Obtenção dos dados](./notebooks/NBAstats_data_gathering.ipynb)
  - [Criação de banco de dados no RDS](./notebooks/NBAstats_db_creation.ipynb)
- Aplicação em produção
  - [API (servidor)](./deploy/backend/)
  - [Aplicação cliente](./deploy/client/)
    - [Exemplo de predição com atributos personalizados](assets/demo_predict_attributes.gif)
    - [Exemplo de predição para jogador real](assets/demo_predict_player.gif)
- [Esquema da arquitetura do projeto](./assets/NBAstats_arquitetura.png)
- [Conjuntos de dados](./data)
