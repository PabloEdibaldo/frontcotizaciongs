
import {ApiService} from '../ApiService';

export const QuoteEndpoint = {
  
  getProduct: () => ApiService.get('quote'),
  getCalculateCote: (idProduct,idRate) => ApiService.get(`quote?productId=${idProduct}&rateId=${idRate}`),

};


