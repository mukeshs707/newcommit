import { API_URL } from "../../../config";
import { axios } from "../../../lib/axios";
import {  GetInventoryResponse } from "../interface";

const getEsimDetails = async (values : any): Promise<any> => {
  return await axios.get(`${API_URL}/esim/details/${values}`);
};

export {
  getEsimDetails,

};
