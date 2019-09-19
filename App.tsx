/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';


import AppConfigService from './src/services/app-config.service';

AppConfigService.init();

export default class extends Component<any> {
  state = {
    isInitialized: false
  }

  componentDidMount() {
    this.initSDK();
  }

  private async initSDK() {
    const isInit = await this._checkSDKStatus();
    if (!isInit) {
      await this.initialize();
    } else {
      this.setState({
        isInitialized: true
      })
    }
    return true
  }

  private async _checkSDKStatus() {
    return await AppConfigService.checkInitStatus();
  }

  private async initialize() {
    const isInitialzed = await AppConfigService.init();
    this.setState({
      isInitialzed
    })
    return isInitialzed;
  }

  render() {

    const isLoggedIn = (() => {
      return this.state.isInitialized ?
        <View style={styles.loggedInContainer}><Text> Initialized </Text></View> :
        <View style={styles.loggedInContainer}><Text> There was an error Initializing </Text></View>
    })();

    return (
      <Fragment>
        <View style={styles.container}>
          {isLoggedIn}
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    backgroundColor: "red",
    padding: 16
  },
  loggedInContainer: {
    marginTop: 64
  }
});
