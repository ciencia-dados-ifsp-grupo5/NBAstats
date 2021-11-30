const API_URL = '/api';
// const API_URL = 'http://localhost:5000';

const PREDICT_URL = API_URL + '/model/predict';
const PLAYER_LIST_URL = API_URL + '/player/list';
const PLAYER_DATA_URL = API_URL + '/player/data';

var player_list = null;

const serializeForm = (form) => {
  const obj = {};
  const formData = new FormData(form);
  for (let key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return obj;
};

const getPlayerList = () => {
  fetch(PLAYER_LIST_URL, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    })
    .then((list) => {
      console.log(list);
      player_list = list;
      let datalist = document.querySelector('#playerlist');
      list.forEach((player) => {
        let option = document.createElement('option');
        option.setAttribute('data-value', player.PLAYER_ID);
        option.setAttribute('value', player.PLAYER_NAME);
        datalist.appendChild(option);
      });
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {});
};

const getPlayerData = (player_id, season_id) => {
  fetch(PLAYER_DATA_URL + `/${player_id}/${season_id}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    })
    .then((data) => {
      console.log(data);
      document
        .querySelector('#featuresContainer')
        .querySelectorAll('input')
        .forEach((input) => {
          input.value = data[input.id];
        });

      salary = Number.parseFloat(data['SALARY_NOMINAL']);

      let divSalary = document.querySelector('#realSalary');
      divSalary.children[1].textContent = salary.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      divSalary.classList.remove('d-none');
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {});
};

document.querySelector('#formParams').addEventListener('submit', (event) => {
  event.preventDefault();

  predResults = document.querySelector('#predResults');
  predValue = document.querySelector('#predValue');
  predLoading = document.querySelector('#predLoading');

  predResults.classList.remove('d-none');
  predValue.classList.add('d-none');
  predLoading.classList.remove('d-none');

  fetch(PREDICT_URL, {
    method: 'POST',
    body: JSON.stringify(serializeForm(event.target)),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response);
    })
    .then((predictions) => {
      console.log(predictions);
      salary = Number.parseFloat(predictions.predictions[0]);
      predValue.textContent = salary.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      });
    })
    .catch((error) => {
      console.error(error);
      predValue.textContent = 'Erro ao obter predições';
    })
    .finally(() => {
      predValue.classList.remove('d-none');
      predLoading.classList.add('d-none');
    });
});

document.getElementsByName('mode').forEach((radio) => {
  radio.addEventListener('change', () => {
    let random = document.querySelector('#divRandom');
    let search = document.querySelector('#divSearch');
    switch (radio.value) {
      case 'player':
        random.classList.add('d-none');
        search.classList.remove('d-none');
        if (!player_list) {
          getPlayerList();
        }
        document
          .querySelector('#featuresContainer')
          .querySelectorAll('input')
          .forEach((input) => {
            input.readOnly = true;
          });
        break;
      case 'fill':
        random.classList.remove('d-none');
        search.classList.add('d-none');
        document
          .querySelector('#featuresContainer')
          .querySelectorAll('input')
          .forEach((input) => {
            input.disabled = false;
          });
        break;
      default:
        break;
    }
  });
});

document.querySelector('#confirmPlayer').addEventListener('click', () => {
  if (!player_list) {
    return;
  }

  let player_name = document
    .querySelector('#divSearch')
    .querySelector('input').value;

  let player = player_list.find((p) => p.PLAYER_NAME == player_name);
  if (player) {
    season_selector = document.querySelector('#SEASON_ID');
    season_selector.querySelectorAll('*').forEach((c) => c.remove());

    [null].concat(player.SEASONS).forEach((season) => {
      let option = document.createElement('option');
      option.setAttribute('value', season ?? '');
      option.text = season ?? 'Selecione';

      season_selector.appendChild(option);
    });
    season_selector.addEventListener('change', () => {
      getPlayerData(player.PLAYER_ID, season_selector.value);
    });
  }
});
