import { APP_CONFIG } from '../config/app-config';
import RNSentiance from 'react-native-sentiance';
import { SDK_STATES } from '../constants/states';

const AppConfigService = {
    init: async () => {
        try {
            await RNSentiance.init(
                APP_CONFIG.APP_ID, APP_CONFIG.APP_SECRET, // app id and secret
                null, // override base url,
                true
            );
            return true
        } catch (err) {
            console.log(`Error Initialiazing SDK ${err}`);
            return false;
        }
    },

    checkInitStatus: async () => {
        try {
            const initialState = await RNSentiance.getInitState();
            return initialState;
        } catch (error){
            return false;
        }
    }


}

export default AppConfigService;