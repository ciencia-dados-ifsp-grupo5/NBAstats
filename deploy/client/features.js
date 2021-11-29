features = [
  {
    name: 'PLAYER_AGE',
    description: 'Idade do jogador',
    min: 14,
    max: 99,
    step: 1,
    placeholder: 'Ex.: 27',
  },
  {
    name: 'GP',
    description: 'Jogos disputados na temporada',
    min: 0,
    max: 99,
    step: 1,
    placeholder: 'Ex.: 65',
  },
  {
    name: 'GS',
    description: 'Jogos que começou como titular',
    min: 0,
    max: 99,
    step: 1,
    placeholder: 'Ex.: 16',
  },
  {
    name: 'MIN',
    description: 'Minutos jogados',
    min: 0,
    max: 9999,
    step: 1,
    placeholder: 'Ex.: 2500',
  },
  {
    name: 'FGM',
    description: 'Arremessos convertidos',
    min: 0,
    max: 9999,
    step: 1,
    placeholder: 'Ex.: 800',
  },
  {
    name: 'FGA',
    description: 'Arremessos tentados',
    min: 0,
    max: 9999,
    step: 1,
    placeholder: 'Ex.: 1500',
  },
  {
    name: 'FG_PCT',
    description: 'Percentual de arremessos convertidos',
    min: 0,
    max: 1,
    step: 0.001,
    placeholder: 'Ex.: ',
  },
  {
    name: 'FG3M',
    description: 'Arremessos convertidos de 3 pontos',
    min: 0,
    max: 9999,
    step: 1,
    placeholder: 'Ex.: 650',
  },
  {
    name: 'FG3A',
    description: 'Arremessos tentados de 3 pontos',
    min: 0,
    max: 9999,
    step: 1,
    placeholder: 'Ex.: 1300',
  },
  {
    name: 'FG3_PCT',
    description: 'Percentual de arremessos convertidos de 3 pontos',
    min: 0,
    max: 1,
    step: 0.001,
    placeholder: 'Ex.: 0.27',
  },
  {
    name: 'FTM',
    description: 'Arremessos convertidos de lances livres',
    min: 0,
    max: 9999,
    step: 1,
    placeholder: 'Ex.: 780',
  },
  {
    name: 'FTA',
    description: 'Arremessos tentados de lances livres',
    min: 0,
    max: 9999,
    step: 1,
    placeholder: 'Ex.: 990',
  },
  {
    name: 'FT_PCT',
    description: 'Percentual de arremessos convertidos de lances livres',
    min: 0,
    max: 1,
    step: 0.001,
    placeholder: 'Ex.: 0.819',
  },
  {
    name: 'OREB',
    description: 'Rebotes ofensivos',
    min: 0,
    max: 999,
    step: 1,
    placeholder: 'Ex.: 34',
  },
  {
    name: 'DREB',
    description: 'Rebotes defensivos',
    min: 0,
    max: 999,
    step: 1,
    placeholder: 'Ex.: 96',
  },
  {
    name: 'REB',
    description: 'Rebotes totais',
    min: 0,
    max: 999,
    step: 1,
    placeholder: 'Ex.: 130',
  },
  {
    name: 'AST',
    description: 'Assistências',
    min: 0,
    max: 9999,
    step: 1,
    placeholder: 'Ex.: 236',
  },
  {
    name: 'STL',
    description: 'Roubos',
    min: 0,
    max: 999,
    step: 1,
    placeholder: 'Ex.: 140',
  },
  {
    name: 'BLK',
    description: 'Bloqueios',
    min: 0,
    max: 999,
    step: 1,
    placeholder: 'Ex.: 198',
  },
  {
    name: 'TOV',
    description: 'Desperdícios de bola (Turnover)',
    min: 0,
    max: 999,
    step: 1,
    placeholder: 'Ex.: 269',
  },
  {
    name: 'PF',
    description: 'Faltas cometidas (Máximo 6 por partida)',
    min: 0,
    max: 999,
    step: 1,
    placeholder: 'Ex.: 94',
  },
  {
    name: 'PTS',
    description: 'Pontos convertidos',
    min: 0,
    max: 9999,
    step: 1,
    placeholder: 'Ex.: 758',
  },
];

const createFeature = (feature) => {
  let divFeature = document.createElement('div');
  divFeature.setAttribute('class', 'row mb-3');

  let label = document.createElement('label');
  label.setAttribute('class', 'col-6 col-form-label text-end');
  label.setAttribute('for', feature.name);
  label.textContent = `${feature.description} (${feature.name})`;

  let divInput = document.createElement('div');
  divInput.setAttribute('class', 'col-6');

  let input = document.createElement('input');
  input.setAttribute('class', 'form-control');
  input.setAttribute('type', 'number');
  input.required = true;
  input.id = feature.name;
  let { description, ...attributes } = feature;
  for (const key in attributes) {
    input.setAttribute(key, feature[key]);
  }

  divFeature.appendChild(label);
  divFeature.appendChild(divInput);
  divInput.appendChild(input);

  return divFeature;
};

const fillWithRandomData = () => {
  document
    .querySelector('#featuresContainer')
    .querySelectorAll('input')
    .forEach((input) => {
      min = Number.parseInt(input.min);
      max = Number.parseInt(input.max);
      step = Number.parseFloat(input.step);

      value = Math.random() * (max - min) + min;

      precision = -1 * Math.log10(step);
      input.value = Number.parseFloat(value).toFixed(precision);
    });
};
document.querySelector('#btnRandom').addEventListener('click', () => {
  fillWithRandomData();
});

let allFeatures = document.querySelector('#featuresContainer');
features.forEach((feature) => {
  allFeatures.appendChild(createFeature(feature));
});
