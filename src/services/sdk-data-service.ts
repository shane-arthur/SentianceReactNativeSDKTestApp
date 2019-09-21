import RNSentianceBridge from 'react-native-sentiance';
import RNSentiance from 'react-native-sentiance';

const SDKDataService = {

    getQuotaData: async () => {
        try {
            const diskQuotaTotal = await RNSentianceBridge.getDiskQuotaLimit();
            const diskQuotaUsed = await RNSentianceBridge.getDiskQuotaUsage();
            const mobileQuotaTotal = await RNSentianceBridge.getMobileQuotaLimit();
            const mobileQuotaUsed = await RNSentianceBridge.getMobileQuotaUsage();
            const wifiQuotaTotal = await RNSentianceBridge.getWiFiQuotaLimit();
            const wifiQuotaUsed = await RNSentianceBridge.getWiFiQuotaUsage();
            return { diskQuotaTotal, diskQuotaUsed, mobileQuotaTotal, mobileQuotaUsed, wifiQuotaTotal, wifiQuotaUsed };
        } catch (error) {
            console.log(`Error getting quota data ${error}`);
            return {
                diskQuotaTotal: 'error', diskQuotaUsed: 'error',
                mobileQuotaTotal: 'error', mobileQuotaUsed: 'error',
                wifiQuotaTotal: 'error', wifiQuotaUsed: 'error'
            };

        }
    },

    getSdkStatus: async () => {
        try {
            const sdkStatus = await RNSentiance.getSdkStatus();
            return sdkStatus
        }
        catch (error) {
            console.log(`Error Fetching SDK Status : ${error}`)
            return {
                startStatus: undefined,
                isRemoteEnabled: undefined,
                isLocationPermGranted: undefined,
                locationSetting: undefined,
                isAccelPresent: undefined,
                isGyroPresent: undefined,
                isGooglePlayServicesMissing: undefined,
                wifiQuotaStatus: undefined,
                mobileQuotaStatus: undefined,
                diskQuotaStatus: undefined
            }
        }
    },

    getUserId: async () => {
        try {
            const userId = await RNSentiance.getUserId();
            return userId;
        }
        catch (error) {
            console.log(`Error Retrieving UserID ${error}`);
            return 'error';
        }
    },

    getSdkVersion: async () => {
        try {
            const sdkVersion = await RNSentiance.getVersion();;
            return sdkVersion;
        }
        catch (error) {
            console.log(`Error Retrieving SDK Version ${error}`);
            return 'error';
        }
    },

    sendUserLinkCallBack: async () => {
        try {
            RNSentiance.userLinkCallback(true)
            return true;
        }
        catch (error) {
            console.log(`Error performing userLinking callback ${error}`);
            return false;
        }
    },

    getUserAccessToken: async () => {
        try{
            const token = RNSentiance.getUserAccessToken();
            return token;
        } catch(error){
            console.log(`Error Fetching Access Token ${error}`);
            return null;
        }
    }


}

export default SDKDataService;