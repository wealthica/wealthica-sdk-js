/* eslint-disable no-alert */
/* eslint-disable no-console */
/* global document, alert, Wealthica, constants, $, renderjson */

let user;
let wealthica;
const loader = '<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#7C2DD4" stroke-width="10" r="29" stroke-dasharray="136.659280431156 47.553093477052"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform></circle></svg>';

// Print result on screen
function printResult(results) {
  document
    .getElementById('result')
    .appendChild(renderjson.set_icons('+', '-').set_show_to_level(2)(results));
}

function login() {
  wealthica = Wealthica.init({
    clientId: constants.WEALTHICA_CLIENT_ID,
    authEndpoint: '/wealthica/auth', // default value, but set here for the sake of demo
    auth: {
      headers: { Authorization: `Bearer ${$('#username').val()}` },
    },
    // The following is for Wealthica developers only, remove if you are a Wealthica client
    baseURL: constants.WEALTHICA_API_URL,
    connectURL: constants.WEALTHICA_CONNECT_URL,
  });

  $('#result').html('');
  $('#response_heading').html(loader);
  user = wealthica.login();
}

$(document).ready(() => {
  $('#connect').click(() => {
    login();

    extraOptions = $('#extra_options').val().trim() || undefined;
    if (extraOptions) extraOptions = JSON.parse(extraOptions);

    user.connect({
      connectionType: constants.WEALTHICA_CONNECT_TYPE,
      ...extraOptions,
    }).onConnection((institution) => {
      console.log('connection success', institution);
    }).onConnection((institution, data) => {
      console.log('connection success', institution, data);
      $('#institution_id').val(institution);
      $('#response_heading').html(`Connected successfully with ID: ${institution}`);
    }).onError((error) => {
      console.log('connection error', error);
      $('#response_heading').html(`Error connecting account: <b class="text-danger">${JSON.stringify(error)}</b>`);
    });
  });

  $('#reconnect').click(() => {
    const institutionId = $('#institution_id').val();
    if (!institutionId) {
      alert('Must enter an Institution ID first.');
      return;
    }

    login();

    extraOptions = $('#extra_options').val().trim() || undefined;
    if (extraOptions) extraOptions = JSON.parse(extraOptions);

    user.reconnect(institutionId, {
      connectionType: constants.WEALTHICA_CONNECT_TYPE,
      ...extraOptions,
    }).onConnection((institution, data) => {
      console.log('reconnection success', institution, data);
      $('#institution_id').val(institution);
    }).onError((error) => {
      console.log('reconnection error', error);
      $('#response_heading').html(`Error reconnecting account: <b class="text-danger">${JSON.stringify(error)}</b>`);
    });
  });

  $('#get_institutions').click(async () => {
    login();

    try {
      const institutions = await user.institutions.getList();
      $('#response_heading').html('All institutions:');
      printResult(institutions);
    } catch (error) {
      console.log('get institutions error', error);
      $('#response_heading').html('');
      $('#result').html(`<code>${error}</code>`);
    }
  });

  $('#get_institution').click(async () => {
    const institutionId = $('#institution_id').val();

    login();

    try {
      const institution = await user.institutions.getOne(institutionId);

      $('#response_heading').html('Institution:');
      printResult(institution);
    } catch (error) {
      console.log('get institution error', error);
      $('#response_heading').html('');
      $('#result').html(`<code>${error}</code>`);
    }
  });

  $('#get_transactions').click(async () => {
    const institutionId = $('#institution_id').val();

    login();

    try {
      const transactions = await user.transactions.getList({ institutions: [institutionId] });

      $('#response_heading').html('All transactions:');
      printResult(transactions);
    } catch (error) {
      console.log('get transaction error', error);
      $('#response_heading').html('');
      $('#result').html(`<code>${error}</code>`);
    }
  });

  $('#get_history').click(async () => {
    const institutionId = $('#institution_id').val();

    login();

    try {
      const history = await user.history.getList({ institutions: [institutionId] });

      $('#response_heading').html('History:');
      printResult(history);
    } catch (error) {
      console.log('get history error', error);
      $('#response_heading').html('');
      $('#result').html(`<code>${error}</code>`);
    }
  });

  $('#get_positions').click(async () => {
    const institutionId = $('#institution_id').val();

    login();

    try {
      const positions = await user.positions.getList({ institutions: [institutionId] });

      $('#response_heading').html('All positions:');
      printResult(positions);
    } catch (error) {
      console.log('get positions error', error);
      $('#response_heading').html('');
      $('#result').html(`<code>${error}</code>`);
    }
  });
});
