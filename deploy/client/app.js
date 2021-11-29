// const API_URL = '/api/model/predict';
const API_URL = 'http://localhost:5000';

const PREDICT_URL = API_URL + '/model/predict';
const PLAYER_LIST_URL = API_URL + '/player/list';

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
        option.setAttribute('data-value', player.id);
        option.setAttribute('value', player.name);
        datalist.appendChild(option);
      });
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
            input.disabled = true;
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

document.querySelector('#playerlist').addEventListener('input', () => {
  console.log('mudou');
});
