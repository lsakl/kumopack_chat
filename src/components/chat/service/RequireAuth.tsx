import React, { ReactNode, useEffect, useState, useContext }  from 'react';
import { useParams, Navigate }			                          from 'react-router-dom';
import { UserContext }                                        from './../context/centerContext'
import { getTokenData, getUserData }                          from '../service/serviceChat';


interface RequireAuthProps {
  children: ReactNode;
  state?: string;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, state }) => {
  const { user, setUser } = useContext(UserContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { userRoute,  __token } = useParams<{ userRoute: string, __token: string }>();
  const __to = new URLSearchParams(window.location.search).get("to");
  const type = new URLSearchParams(window.location.search).get("type");
  
  const checkAuthentication = async () => {
    if(state === 'auth'){
      try {
        const response = await getTokenData({
          userRoute: userRoute,
          __token: __token,
          __to: __to,
          type: type
        });
        
        if (response.status) {
          setUser({ ...user,
            userId      : response.data.userId || "",
            uuId        : response.data.uuId || "",
            fullnameTh  : response.data.fullnameTh || "",
            fullnameEn  : response.data.fullnameEn || "",
            email       : response.data.email || "",
            image       : response.data.image || "",
            userType    : response.data.userType || "",
            accessToken : response.data.accessToken || "",
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    }else{
      try {
        const response = getUserData();
        
        if (response.status && response.data.accessToken) {
          setUser({ ...user,
            userId      : response.data.userId || "",
            uuId        : response.data.uuId || "",
            fullnameTh  : response.data.fullnameTh || "",
            fullnameEn  : response.data.fullnameEn || "",
            email       : response.data.email || "",
            image       : response.data.image || "",
            userType    : response.data.userType || "",
            accessToken : response.data.accessToken || "",
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    }
  };

  useEffect(() => {
    checkAuthentication();
    // eslint-disable-next-line
  }, []);

  if (isAuthenticated) {
    if (state === 'auth') {
      return <Navigate to={`/`} />;
    }else{
      return <>{children}</>;
    }
  } else {
    return <>{children}</>;
  }
};

export default RequireAuth;
