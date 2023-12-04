import React, { ReactNode, useEffect, useState, useContext }  from 'react';
import { useParams, Navigate }                                from 'react-router-dom';
import { UserContext }                                        from './../context/centerContext'
import { getTokenData, getUserData }                          from '../service/serviceChat';
import { Modal }                                              from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';

import './../../../styles/modal.scss';

interface RequireAuthProps {
  children: ReactNode;
  state?: string;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, state }) => {
  const { user, setUser } = useContext(UserContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    handleGoBack();
    setShowModal(false);
  };

  const { userRoute,  __token } = useParams<{ userRoute: string, __token: string }>();
  const __to = new URLSearchParams(window.location.search).get("to");
  const type = new URLSearchParams(window.location.search).get("type");

  

  const handleGoBack = () => {
    window.close();
  };
  
  const checkAuthentication = async () => {
    if(state === 'auth'){
      try {
        const response = await getTokenData({
          userRoute: userRoute,
          __token: __token,
          __to: __to || "",
          type: type || "",
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
        }else{
          handleShow();
          setIsAuthenticated(false);
        }
      } catch (error) {
        handleShow();
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
        console.log(error);
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
    return <div className='modal'>
            <Modal show={showModal} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>เข้าสู่ระบบสนทนา</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>ขออภัยในความไม่สะดวกที่ท่านพบในการเข้าสู่ระบบครั้งนี้ กรุณาปิดหน้านี้และลองเข้าถึงระบบอีกครั้งหรือคลิกปุ่มข้างล่างนี้</p>
              </Modal.Body>
              <Modal.Footer className='d-flex justify-content-start'>
                <button type="button" onClick={handleGoBack} className="btn btn-sm btn-back w-100"><FontAwesomeIcon icon={faLeftLong} size="lg" className='mr-1'/> กลับไปก่อนหน้า</button>
              </Modal.Footer>
            </Modal>
          </div>;
  }
};

export default RequireAuth;