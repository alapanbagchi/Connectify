// Api.js
import axios from "axios";

// Create a instance of axios to use the same base url.
const axiosAPI = axios.create({
  baseURL: "https://backend.loca.lt" // it's not recommended to have this info here.
});
//Set cookies from response

axios.defaults.withCredentials = true;

// implement a method to execute all the request from here.
const apiRequest = (method: string, url: any, request: any) => {
  const headers = {
    credentials: "include",
    "Content-Type": "application/json",
    };
  //using the axios instance to perform the request that received from each http method
  return axiosAPI({
    method,
    url,
    data: request,
    headers,
    withCredentials: true,
  }).then((res:any) => {
    return Promise.resolve(res.data);
  })
    .catch((err:any) => {
      return Promise.reject(err);
    });
};

// function to execute the http get request
const get = (url: any, request: any) => apiRequest("get", url, request);

// function to execute the http delete request
const deleteRequest = (url: any, request: any) => apiRequest("delete", url, request);

// function to execute the http post request
const post = (url: any, request: any) => apiRequest("post", url, request);

// function to execute the http put request
const put = (url: any, request: any) => apiRequest("put", url, request);

// function to execute the http path request
const patch = (url: any, request: any) => apiRequest("patch", url, request);

// expose your method to other services or actions
const API = {
  get,
  delete: deleteRequest,
  post,
  put,
  patch
};
export default API;