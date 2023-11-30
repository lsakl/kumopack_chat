import React, { useRef, useState, useEffect, useContext } from 'react'
import { PartnerContext, UserContext}                     from './../context/centerContext'
import data                                               from '@emoji-mart/data'
import Picker                                             from '@emoji-mart/react'
import { useTranslation }                                 from 'react-i18next';
import { messageFileUpload }                              from '../service/serviceChat';

interface ChatEditorProps {
  socket: any;
}

const ChatEditor: React.FC<ChatEditorProps> = ({ socket }) => {
  const { t }           = useTranslation();
  const { user }        = useContext(UserContext);
  const { partner }     = useContext(PartnerContext);
  const ref             = useRef<HTMLUListElement>(null);
  const refEmoji        = useRef<HTMLDivElement>(null);
  const fileInputRef    = useRef<HTMLInputElement>(null);
  const imageInputRef   = useRef<HTMLInputElement>(null);
  const inputRef        = useRef<HTMLTextAreaElement>(null);

  const [btnCtrl, setBtnCtrl]                       = useState<boolean>(false);
  const [btnEmoji, setBtnEmoji]                     = useState<boolean>(false);
  const [message, setMessage]                       = useState<string>('');
  const [cursorPositionTemp, setCursorPositionTemp] = useState<number>(0);

  const [file, setFile]                             = useState<File | null>(null);
  const [base64Image, setBase64Image]               = useState<string | null>(null);
  const [fileIsHovered, setFileIsHovered]           = useState<boolean>(false);

  function handleClickBtnCtrl(e: React.MouseEvent<HTMLButtonElement>, action: boolean) {
    setBtnCtrl(action);
  }

  function handleClickOutside(event: MouseEvent) {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setBtnCtrl(false);
    }

    if (refEmoji.current && !refEmoji.current.contains(event.target as Node)) {
      setBtnEmoji(false);
    }
  }

  const handleLinkFileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    fileInputRef.current!.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setBtnCtrl(false);
      setFile(event.target.files[0]);
    }else{
      setFile(null);
    }
  };
  
  const handleLinkImageClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    imageInputRef.current!.click();
  };

  const handleImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setBtnCtrl(false);
      setFile(event.target.files[0]);
      const file = event.target.files?.[0];
    
      if (file) {
        const reader = new FileReader();

        reader.onloadend = function () {
          setBase64Image(reader.result as string);
        };

        reader.readAsDataURL(file);
      } else {
        setBase64Image(null);
      }
    }else{
      setFile(null);
    }
  };

  function handleClickBtnEmoji(e: React.MouseEvent<HTMLButtonElement>, action: boolean) {
    setBtnEmoji(action);
  }
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessageData();
    }
  };

  const sendMessageData = async () => { 
    if (message.trim() !== '') {

      if(socket){
        socket.emit('chat_message', {
          from		: user.userId,
          to 			: partner.userId,
          message 	: message,
          data		: {},
          datetime 	: new Date(),
          messageType : "message"
        });
      }
      
      setMessage('');
    }else if(file){
      const response = await messageFileUpload(file);
      if(response.status===200){
        if(socket){
          socket.emit('chat_message', {
            from		: user.userId,
            to 			: partner.userId,
            message 	: '',
            data		: response.data,
            datetime 	: new Date(),
            messageType : response.data.type
          });
        }
        setFile(null);
      }
    }
  }

  const handleEmojiSelect = (selectedEmoji: any) => {
    if (inputRef.current) {

      let cursorPosition = inputRef.current.selectionStart || 0;
      if(cursorPositionTemp===0){
        setCursorPositionTemp(cursorPosition);
      }else{
        cursorPosition = cursorPositionTemp;
      }
      
      setMessage(message.substring(0, cursorPosition) + selectedEmoji.native + message.substring(cursorPosition));
      setCursorPositionTemp(cursorPosition+selectedEmoji.native.length);
    }
  };

  useEffect(() => {
    if(!btnEmoji){
      setCursorPositionTemp(0);
    }
  }, [btnEmoji, cursorPositionTemp]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // useEffect(() => {
    
  // }, [file]);

  const checkFileType = (fileType:string) => {
    if (fileType.startsWith("image/")) {
        return "image";
    } else {
        return "file";
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileIsHovered(false);
    setBase64Image(null);
  };

  const truncateText = (text: string): string => {
    return text.length > 10 ? text.substring(0, 10) + '...' : text;
  }

  return (
    <>
    <div className='w-100' style={{borderTop: "1px solid #D0D5DD"}}>
      <div className="nk-chat-editor">
        <div className='chat-editor-fram d-flex flex-column bd-highlight mb-2'>
          {!file && (<div className="nk-chat-editor-form">
            <div className="form-control-wrap">
              <textarea 
                className="form-control form-control-simple no-resize scroll_gray" 
                rows={2} id="default-textarea" 
                placeholder={t('sendAMessage')||''}
                value={message}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                maxLength={1000}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
          </div>)}
          <div className='row'>
            <div className="col-6 d-flex align-items-center">
              {file && (
                <>
                {checkFileType(file.type)==="image" &&
                  <div className='image-box-send'>
                    <div className='image-wait-upload-box'>
                      <span onMouseEnter={() => setFileIsHovered(true)} onMouseLeave={() => setFileIsHovered(false)}>
                        {base64Image?(<img src={base64Image} alt="รูปตัวอย่างก่อนส่ง" />):(<em className="icon ni ni-img-fill"></em>)}
                        {fileIsHovered && (<em className="icon ni ni-cross-sm remove-file" onClick={removeFile}></em>)}
                      </span>
                    </div>
                  </div>
                }

                {checkFileType(file.type)==="file" &&
                  <div className='file-box-send'>
                    <div className='file-wait-upload-box'>
                      <span onMouseEnter={() => setFileIsHovered(true)} onMouseLeave={() => setFileIsHovered(false)}>
                        <em className="icon ni ni-clip"></em>
                        {fileIsHovered && (<em className="icon ni ni-cross-sm remove-file" onClick={removeFile}></em>)}
                      </span>
                      <small> {truncateText(file.name)}</small>
                    </div>
                  </div>
                }
                </>
              )}
            </div>
            <div className="col-6 d-flex justify-content-end">
              <div className="d-flex justify-content-end align-items-end">

                {btnCtrl && (
                  <>
                    <ul className="nk-chat-editor-tools g-2" ref={ref}>
                      <li>
                        <button onClick={handleLinkImageClick} className="cursor-pointer hoverable clip-image-attach-file"><em className="icon ni ni-img-fill"></em></button>
                        <input type="file" className='clip-image-input-none' accept=".gif,.jpg,.jpeg,.png" onChange={handleImageInputChange} ref={imageInputRef} />
                      </li>
                      <li>
                        <button onClick={handleLinkFileClick} className="cursor-pointer hoverable clip-image-attach-file"><em className="icon ni ni-clip"></em></button>
                        <input type="file" className='clip-image-input-none' accept=".pdf" onChange={handleFileInputChange} ref={fileInputRef} />
                      </li>
                      <li>
                        <button className="btn btn-sm" onClick={(event) => handleClickBtnCtrl(event, false)}><em className="icon ni ni-cross-sm text-danger"></em></button>
                      </li>
                    </ul>
                    <ul className="nk-chat-editor-tools g-2">
                      <li>
                        <button className="btn btn-send-bg" onClick={sendMessageData}>{t('send')}</button>
                      </li>
                    </ul>
                  </>
                  )}

                  {!btnCtrl && (
                    <>
                      {!btnEmoji && (
                      <>
                        <ul className="nk-chat-editor-tools g-2">
                          <li>
                            <button className="btn btn-sm" onClick={(event) => handleClickBtnCtrl(event, true)}><em className="icon ni ni-more-h-alt"></em></button>
                          </li>
                          <li>                      
                            <button className="btn btn-sm" onClick={(event) => handleClickBtnEmoji(event, true)}><em className="icon ni ni-happy"></em></button>
                          </li>
                        </ul>
                        <ul className="nk-chat-editor-tools g-2">
                          <li>
                            <button className="btn btn-send-bg" onClick={sendMessageData}>{t('send')}</button>
                          </li>
                        </ul>
                      </>
                    )}
                    {btnEmoji && (
                      <>
                        <ul className="nk-chat-editor-tools g-2">
                          <li>
                            <div className='emoji-mart' ref={refEmoji}>
                              <Picker data={data} onEmojiSelect={handleEmojiSelect} set="native"/>
                            </div>
                            
                            <button className="btn btn-sm" onClick={(event) => handleClickBtnEmoji(event, false)}><em className="icon ni ni-cross-sm text-danger"></em></button>
                          </li>
                        </ul>
                        <ul className="nk-chat-editor-tools g-2">
                          <li>
                            <button className="btn btn-send-bg" onClick={sendMessageData}>{t('send')}</button>
                          </li>
                        </ul>
                      </>
                    )}
                  </>
                  )} 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
    
  )
}

export default ChatEditor