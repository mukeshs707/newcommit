import { AUTH } from "./auth";

const storage = {
	getToken: () => {
		return "test";// window.localStorage.getItem("token");
	},
	setToken: (token: string) => {
		return "test";//// window.localStorage.setItem("token", token);
	},
	clearToken: () => {
		return "test";// window.localStorage.removeItem("token");
	},
	validateRememberMe:()=>{
		return true;
		// if(window.localStorage.getItem(AUTH.REMEMBERME)===AUTH.TRUE)
		// {
		// 	return true;
		// }
		// else{
		// 	return false
		// }
	}
	,
	storeRememberMe:(token:string)=>{
		return "test";//// window.localStorage.setItem(AUTH.REMEMBERME, token);
	}

};

export default storage;