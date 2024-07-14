
import {ApiService} from '../ApiService';

export const RateEndpoint = {
  
  getRate: () => ApiService.get('rate'),
  postRate: (userRate) => ApiService.post('rate',userRate),

};