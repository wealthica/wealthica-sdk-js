/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet, View, Button} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  WEALTHICA_CONNECT_CLIENT_ID,
  WEALTHICA_CONNECT_URL,
  WEALTHICA_API_URL,
} from '@env';

import Wealthica from 'wealthica-sdk-js/dist/wealthica.es5';
import {authorize} from 'react-native-app-auth';

const bundleId = DeviceInfo.getBundleId();
const clientId = WEALTHICA_CONNECT_CLIENT_ID;

const userId = 'uniqueuserid001';

const wealthica = Wealthica.init({
  clientId,

  // The following is for Wealthica developers only, remove if you are a Wealthica client
  baseURL: WEALTHICA_API_URL,
  connectURL: WEALTHICA_CONNECT_URL,

  async authorizer(callback) {
    const response = await fetch('http://localhost:3008/wealthica/auth', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userId}`,
      },
    });
    const data: any = await response.json();

    callback(null, {token: data.token});
  },
});

async function openConnect() {
  console.log('openConnect');
  try {
    const user = wealthica.login(userId);
    const token = await user.fetchToken();
    const connectUrl = WEALTHICA_CONNECT_URL;

    const redirectUrl = `${bundleId}://oauth`; // need to be registered with Wealthica
    const authorizeUrl = `${connectUrl}/connect`;

    const result = await authorize({
      serviceConfiguration: {
        authorizationEndpoint: authorizeUrl,
        tokenEndpoint: authorizeUrl, // required by AppAuth
      },
      clientId,
      redirectUrl,
      useNonce: false,
      usePKCE: false, // true will cause problem with Questrade
      additionalParameters: {token, lang: 'en'},
      skipCodeExchange: true,
      clientAuthMethod: 'post',
      scopes: [],
    });

    // TODO display result in the app
    console.log('result', result);

    const institutionId = result.authorizationCode;
    // sendToServer(institutionId);
    console.info('institution id', institutionId);
    const institution = await user.institutions.getOne(institutionId);
    console.log('institution', institution);
  } catch (err) {
    console.error('authorize error', err);
  }
}

function Connect(): JSX.Element {
  return (
    <View style={styles.container}>
      <Button title="Connect Account" color="white" onPress={openConnect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3A216F',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default Connect;
