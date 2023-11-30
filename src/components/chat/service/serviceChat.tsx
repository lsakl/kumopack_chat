import axios from "axios";
import { io } from "socket.io-client";

export const baseURL      = "http://localhost:3001/api";
export const socketServer = "http://localhost:3001";
axios.defaults.baseURL  = baseURL;

export const getTokenData = async (data:any) => {
  try {

    const response = await axios.post('/login', data);
    console.log(response.data);
    if(response && response.status=== 200){
      localStorage.setItem('userId',      response.data.data.user._id);
      localStorage.setItem('uuId',        response.data.data.user.uuId);
      localStorage.setItem('fullnameTh',  response.data.data.user.fullnameTh);
      localStorage.setItem('fullnameEn',  response.data.data.user.fullnameEn);
      localStorage.setItem('email',       response.data.data.user.email);
      localStorage.setItem('image',       response.data.data.user.image);
      localStorage.setItem('userType',    response.data.data.user.userType);
      localStorage.setItem('status',      response.data.data.user.status);
      localStorage.setItem('accessToken', response.data.accessToken);
      return {
        status : true,
        data : {
          userId      : response.data.data.user._id,
          uuId        : response.data.data.user.uuId,
          fullnameTh  : response.data.data.user.fullnameTh,
          fullnameEn  : response.data.data.user.fullnameEn,
          email       : response.data.data.user.email,
          image       : response.data.data.user.image,
          userType    : response.data.data.user.userType,
          status      : response.data.data.user.status,
          accessToken : response.data.accessToken,
        },
      };
    }else{
      return {status : false, data : {}};
    }

  } catch (error) {
    console.error(error);
    return {status : false, data : {}};
  }
};

export const getUserData = () => {
  try {
    return {
      status  : true,
      data    : {
        userId      : localStorage.getItem('userId'),
        uuId        : localStorage.getItem('uuId'),
        fullnameTh  : localStorage.getItem('fullnameTh'),
        fullnameEn  : localStorage.getItem('fullnameEn'),
        email       : localStorage.getItem('email'),
        image       : localStorage.getItem('image'),
        userType    : localStorage.getItem('userType'),
        status      : localStorage.getItem('status'),
        accessToken : localStorage.getItem('accessToken'),
      }
    };
  } catch (error) {
    return {
      status  : false,
      data    : {}
    };
  }
};

const createHeader = (type:string) => {
  const user = getUserData();

  const payloadHeader = {
    headers: {
      'Content-Type': (type===''||type==='json')?'application/json':'multipart/form-data',
      authorization: `Bearer ${user.data.accessToken}`,
    },
  };
  return payloadHeader;
};

export const iniSocket = () => {
  const user = getUserData();

  const socket = io(socketServer, {
    extraHeaders: {
      authorization : `Bearer ${user.data.accessToken}`,
      userid        : `${user.data.userId}`,
      Usertype      : `${user.data.userType}`
    },
  });
  return socket;
};

export const getUserListData = async (userId:string, search:string, page:number, limit:number) => {
  const header = await createHeader('json');
  try {
    const response = await axios.post(`/contact/list`, {
      userId  : userId,
      search  : search,
      page    : page,
      limit   : limit
    }, header);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const messageFileUpload = async (file:any) => {
  const header = await createHeader('file');
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`/storage`, formData, header);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};