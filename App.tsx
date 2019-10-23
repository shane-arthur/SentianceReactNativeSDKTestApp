
import React, { Fragment, Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  NativeEventEmitter,
  Button,
  Alert,
  ScrollView
} from 'react-native';
import reactNativeSentianceBridge from "react-native-sentiance";
import AppConfigService from './src/services/app-config.service';
import UserActivityService from './src/services/user-activity.service';
import SDKDataService from './src/services/sdk-data-service';
import { SDK_STATES } from './src/constants/states'


const reactNativeSentianceSdkEventEmitter = new NativeEventEmitter(reactNativeSentianceBridge);

export default class extends Component<any> {
  state = {
    isInitialized: false,
    userId: undefined,
    installId: undefined,
    sdkVersion: undefined,
    diskQuota: '',
    mobileQuota: '',
    wifiQuota: '',
    tripType: undefined,
    userAccessToken: undefined
  }

  sdkStatusUpdateSub: any = undefined;
  sdkUserActivitySub: any = undefined;
  userLinkingSub: any = undefined;

  componentDidMount() {
    this.initSDK();
  }
  componentWillUnmount() {
    this.sdkStatusUpdateSub.remove();
    this.sdkUserActivitySub.remove();
    this.userLinkingSub.remove();
  }

  private addEventListeners() {

    this.sdkStatusUpdateSub = reactNativeSentianceSdkEventEmitter.addListener(
      'SDKStatusUpdate',
      this.getQuotas
    );

    this.sdkStatusUpdateSub = reactNativeSentianceSdkEventEmitter.addListener(
      'SDKUserActivityUpdate',
      data => {
        const { type } = data;
        const tripType = UserActivityService.getTripType(type);
        this.setState({ tripType });
      }
    );

    this.userLinkingSub = reactNativeSentianceSdkEventEmitter.addListener(
      "SDKUserLink",
      id => {
        const { installId } = id;
        this.setState({
          installId
        })

        //send this installid to you server for linking
        // for now we'll comment this out, this listener is just here for testing purposes to make sure it fires
        //linkUser(installId);

        //once linking is done notify sdk
        SDKDataService.sendUserLinkCallBack();
      }
    );
  }

  private async initSDK() {
    const initStatus = await this._checkSDKStatus();
    switch (initStatus) {
      case SDK_STATES.NOT_INITIALIZED: {
        const isInitialized = await this.initialize();
        this.setState({ isInitialized })
        break;
      }
      case SDK_STATES.INIT_IN_PROGRESS: {
        // need to know what to do here !!!
        break;
      }
      case SDK_STATES.INITIALIZED: {
        this.setState({
          isInitialized: true
        });
        this.start();
        break;
      }
      default: break;
    }

    return true
  }

  private async start() {
    try {
      await this.getDataUserData();
      const sdkStatusData = await SDKDataService.getSdkStatus();
      await this.getQuotas(sdkStatusData);
      this.addEventListeners();
    } catch (error) {
      console.log(`Error fetching startup data ${error}`);
    }
  }

  private async getDataUserData() {
    const userId = await SDKDataService.getUserId();
    const sdkVersion = await SDKDataService.getSdkVersion();
    const userAccessToken = await SDKDataService.getUserAccessToken();
    this.setState({ userId, sdkVersion, userAccessToken });
  }

  private async getQuotas(sdkStatusData: any) {
    const data = await SDKDataService.getQuotaData();

    const { wifiQuotaStatus, mobileQuotaStatus, diskQuotaStatus } = sdkStatusData;
    const { wifiQuotaTotal, wifiQuotaUsed, mobileQuotaTotal, mobileQuotaUsed, diskQuotaTotal, diskQuotaUsed } = data;

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
    if (isInitialzed) {
      this.start();
    }
    return isInitialzed;
  }

  render() {

    const { userId, sdkVersion, mobileQuota, diskQuota, wifiQuota, tripType } = this.state;
    const disabled = this.state.isInitialized;

    const isLoggedIn = (() => {
      return this.state.isInitialized ?
        <Text> Initialized </Text> :
        <Text> There was an error Initializing </Text>
    })();

    return (
      <Fragment>
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.itemContainer}>
              <Text style={styles.textContainer}> Status: </Text>
              <Text style={styles.textContainer}>{isLoggedIn}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.textContainer}>User Id: </Text>
              <Text style={styles.textContainer}>{userId}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.textContainer}>SDK Version: </Text>
              <Text style={styles.textContainer}>{sdkVersion}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.textContainer}>Mobile Quota: </Text>
              <Text style={styles.textContainer}>{mobileQuota}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.textContainer}>Disk Quota: </Text>
              <Text style={styles.textContainer}>{diskQuota}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.textContainer}>Wifi Quota: </Text>
              <Text style={styles.textContainer}>{wifiQuota}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.textContainer}>Trip Type: </Text>
              <Text style={styles.textContainer}>{tripType}</Text>
            </View>
          </ScrollView>
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
    flexDirection: 'column',

  },
  itemContainer: {
    marginTop: 64,
    flex: 1,
    flexDirection: 'row',
  },
  textContainer: {
    fontSize: 18
  }
});
