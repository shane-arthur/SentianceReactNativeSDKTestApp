
import React, { Fragment, Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  NativeEventEmitter
} from 'react-native';
import reactNativeSentianceBridge from "react-native-sentiance";
import AppConfigService from './src/services/app-config.service';

const reactNativeSentianceSdkEventEmitter = new NativeEventEmitter(reactNativeSentianceBridge);

export default class extends Component<any> {
  state = {
    isInitialized: false,
    userId: undefined,
    sdkVersion: undefined,
    diskQuota: '',
    mobileQuota: '',
    wifiQuota: ''
  }

  sdkStatusUpdateSub: any = undefined;
  sdkUserActivitySub: any = undefined;

  componentDidMount() {
    this.initSDK();
    this.addEventListeners();
  }

  private addEventListeners() {
    this.sdkStatusUpdateSub = reactNativeSentianceSdkEventEmitter.addListener(
      'SDKStatusUpdate',
      console.log
    );

    this.sdkStatusUpdateSub = reactNativeSentianceSdkEventEmitter.addListener(
      'SDKUserActivityUpdate',
      console.log
    );
  }

  private async initSDK() {
    const isInit = await this._checkSDKStatus();
    if (!isInit) {
      await this.initialize();
    } else {
      this.setState({
        isInitialized: true
      });
      this.start();
    }
    return true
  }

  private async start() {
    try {
      await this.getDataUserData();
      const sdkStatusData = await reactNativeSentianceBridge.getSdkStatus();
      await this.getQuotas(sdkStatusData);
    } catch (error) {
      console.log(`Error fetching startup data ${error}`);
    }
  }

  private async getDataUserData() {
    const userId = await reactNativeSentianceBridge.getUserId();
    const sdkVersion = await reactNativeSentianceBridge.getVersion();
    this.setState({ userId, sdkVersion });
  }

  private async getQuotas(sdkStatusData: any) {
    const diskQuotaTotal = await reactNativeSentianceBridge.getDiskQuotaLimit();
    const diskQuotaUsed = await reactNativeSentianceBridge.getDiskQuotaUsage();
    const mobileQuotaTotal = await reactNativeSentianceBridge.getMobileQuotaLimit();
    const mobileQuotaUsed = await reactNativeSentianceBridge.getMobileQuotaUsage();
    const wifiQuotaTotal = await reactNativeSentianceBridge.getWiFiQuotaLimit();
    const wifiQuotaUsed = await reactNativeSentianceBridge.getWiFiQuotaUsage();

    const { wifiQuotaStatus, mobileQuotaStatus, diskQuotaStatus } = sdkStatusData;

    const wifiQuota = `${wifiQuotaStatus} : ${wifiQuotaUsed}/${wifiQuotaTotal} (kb)`
    const diskQuota = `${diskQuotaStatus} : ${diskQuotaUsed}/${diskQuotaTotal} (kb)`;
    const mobileQuota = `${mobileQuotaStatus} : ${mobileQuotaUsed}/${mobileQuotaTotal} (kb)`;

    this.setState({ wifiQuota, mobileQuota, diskQuota });

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

    const { userId, sdkVersion, mobileQuota, diskQuota, wifiQuota } = this.state;


    const isLoggedIn = (() => {
      return this.state.isInitialized ?
        <Text> Initialized </Text> :
        <Text> There was an error Initializing </Text>
    })();

    return (
      <Fragment>
        <View style={styles.container}>
          <View style={styles.itemContainer}>
            <Text> Status: </Text>
            {isLoggedIn}
          </View>
          <View style={styles.itemContainer}>
            <Text>User Id: </Text>
            <Text>{userId}</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text>SDK Version: </Text>
            <Text>{sdkVersion}</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text>Mobile Quota: </Text>
            <Text>{mobileQuota}</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text>Disk Quota: </Text>
            <Text>{diskQuota}</Text>
          </View>
          <View style={styles.itemContainer}>
            <Text>Wifi Quota: </Text>
            <Text>{wifiQuota}</Text>
          </View>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "red",
    padding: 16,
    flexDirection: 'column'

  },
  infoContainer: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "red",
    padding: 16,
    flexDirection: 'row'
  },
  itemContainer: {
    marginTop: 64,
    flex: 1,
    flexDirection: 'row'
  }
});
