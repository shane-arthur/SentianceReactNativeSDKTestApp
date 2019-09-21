import RNSentiance from 'react-native-sentiance';
import { ACTIVITY_STATES, TRIP_TYPES } from '../constants/states';


const UserActivityService = {

    getTripType: (type: string) => {
        switch (type) {
            case ACTIVITY_STATES.USER_ACTIVITY_TYPE_STATIONARY:
                return TRIP_TYPES.STATIONARY;
            case ACTIVITY_STATES.USER_ACTIVITY_TYPE_TRIP:
                return TRIP_TYPES.TRIP;
            case ACTIVITY_STATES.USER_ACTIVITY_TYPE_UNKNOWN:
                return TRIP_TYPES.UNKNOWN
            default: return TRIP_TYPES.UNKNOWN
        }
    },


}

export default UserActivityService;