const API_URL = '/api';
// const API_URL = 'http://localhost:5000';

const PREDICT_URL = API_URL + '/model/predict';
const SEASON_LIST_URL = API_URL + '/player/season/list';
const PLAYER_LIST_URL = API_URL + '/player/list';
const PLAYER_DATA_URL = API_URL + '/player/data';

/**
 *
 * ===================
 * === MEMOIZATION ===
 */

var player_list = null;
var season_list = null;

/**
 *
 * ============
 * === UTIL ===
 */

const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);
  for (let key of formData.keys()) {
    obj[key] = Number(formData.get(key));
  }
  return obj;
};

const hideResults = () => {
  predResults = document.querySelector('#predResults');
  realSalary = document.querySelector('#realSalary');

  predResults.classList.add('d-none');
  realSalary.classList.add('d-none');
};

const clearFeaturesData = () => {
  document.querySelector('#SEASON_ID').value = '';
  document
    .querySelector('#featuresContainer')
    .querySelectorAll('input')
    .forEach((input) => {
      input.value = '';
    });
};

const clearPlayerInput = () => {
  document.querySelector('#divSearch').querySelector('input').value = '';
};

const fillSeasonSelect = (season, defaultSelect = 'Selecione') => {
  season_selector = document.querySelector('#SEASON_ID');
  new_selector = season_selector.cloneNode(false);
  [null].concat(season).forEach((s) => {
    let option = document.createElement('option');
    option.setAttribute('value', s ?? '');
    option.text = s ?? defaultSelect;
    new_selector.appendChild(option);
  });
  season_selector.parentNode.replaceChild(new_selector, season_selector);
  return new_selector;
};

const fillPlayerDataList = (player) => {
  let datalist = document.querySelector('#playerlist');
  datalist.querySelectorAll('*').forEach((option) => option.remove());
  player.forEach((p) => {
    let option = document.createElement('option');
    option.setAttribute('data-value', p.PLAYER_ID);
    option.setAttribute('value', p.PLAYER_NAME);
    datalist.appendChild(option);
  });
};

const fillPlayerData = (data) => {
  document
    .querySelector('#featuresContainer')
    .querySelectorAll('input')
    .forEach((input) => {
      input.value = data[input.id];
    });

  let salary = Number.parseFloat(data['SALARY_REAL']);

  let divSalary = document.querySelector('#realSalary');
  divSalary.children[1].textContent = salary.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  divSalary.classList.remove('d-none');
};

const setFeaturesReadOnly = (readOnly) => {
  document
    .querySelector('#featuresContainer')
    .querySelectorAll('input')
    .forEach((input) => {
      input.readOnly = readOnly;
    });
};

/**
 *
 * ===================
 * === API REQUEST ===
 */

const getSeasonList = async () => {
  if (season_list) {
    return season_list;
  }
  try {
    let response = await fetch(SEASON_LIST_URL, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    season_list = await response.json();
    console.info('[SEASON LIST]', season_list);
    return season_list;
  } catch (error) {
    console.error(error);
  }
};

const getPlayerList = async () => {
  if (player_list) {
    return player_list;
  }
  try {
    let response = await fetch(PLAYER_LIST_URL, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    player_list = await response.json();
    console.info('[PLAYER LIST]', player_list);
    return player_list;
  } catch (error) {
    console.error(error);
  }
};

const getPlayerData = async (player_id, season_id) => {
  try {
    let response = await fetch(PLAYER_DATA_URL + `/${player_id}/${season_id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    let data = await response.json();
    console.info('[PLAYER DATA]', data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const postPredict = async (body) => {
  try {
    let response = await fetch(PREDICT_URL, {
      method: 'POST',
      body: body,
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    let predictions = await response.json();
    console.info('[PREDICTIONS]', predictions);
    return predictions;
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * ======================
 * === ACTION HANDLER ===
 */

const submitForm = (event) => {
  event.preventDefault();

  predResults = document.querySelector('#predResults');
  predValue = document.querySelector('#predValue');
  predLoading = document.querySelector('#predLoading');

  predResults.classList.remove('d-none');
  predValue.classList.add('d-none');
  predLoading.classList.remove('d-none');

  let body = JSON.stringify(serializeForm(event.target));
  postPredict(body)
    .then((predictions) => {
      let salary = Number.parseFloat(predictions.predictions[0]);
      predValue.textContent = salary.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    })
    .catch(() => {
      predValue.textContent = 'Erro ao obter predições';
    })
    .finally(() => {
      predValue.classList.remove('d-none');
      predLoading.classList.add('d-none');
    });
};

const switchAppMode = (mode) => {
  let random = document.querySelector('#divRandom');
  let search = document.querySelector('#divSearch');

  hideResults();
  clearFeaturesData();
  clearPlayerInput();

  switch (mode) {
    case 'player':
      random.classList.add('d-none');
      search.classList.remove('d-none');
      getPlayerList().then((player) => fillPlayerDataList(player));
      setFeaturesReadOnly(true);
      break;
    case 'fill':
      random.classList.remove('d-none');
      search.classList.add('d-none');
      getSeasonList().then((season) => fillSeasonSelect(season));
      setFeaturesReadOnly(false);
      break;
  }
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

const confirmPlayerSelect = () => {
  if (!player_list) {
    return;
  }

  let player_name = document
    .querySelector('#divSearch')
    .querySelector('input').value;

  let player = player_list.find((p) => p.PLAYER_NAME == player_name);
  if (player) {
    hideResults();
    clearFeaturesData();

    season_selector = fillSeasonSelect(
      player.SEASONS,
      'Temporadas de ' + player.PLAYER_NAME
    );
    season_selector.addEventListener('change', () => {
      hideResults();
      getPlayerData(player.PLAYER_ID, new_selector.value).then((data) =>
        fillPlayerData(data)
      );
    });
  }
};

/**
 *
 * ======================
 * === EVENT LISTENER ===
 */

document.querySelector('#btnRandom').addEventListener('click', () => {
  fillWithRandomData();
});

document.querySelector('#formParams').addEventListener('submit', (event) => {
  submitForm(event);
});

document.getElementsByName('mode').forEach((radio) => {
  radio.addEventListener('change', () => {
    switchAppMode(radio.value);
  });
});

document.querySelector('#confirmPlayer').addEventListener('click', () => {
  confirmPlayerSelect();
});

/**
 *
 * =======================
 * === ON START ACTION ===
 */

getSeasonList().then((season) => fillSeasonSelect(season));
