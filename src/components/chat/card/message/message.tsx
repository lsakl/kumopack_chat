import React from 'react';
import ChatBubbles  from './chatBubbles';
import ChatLine  from './chatLine';

type Props = {
  type?      : string;
  who?      : string;
  name?     : string
  data?     : any;//urlImage, urlFile, Text
  dataId?   : string;
  datetime? : Date;
  meta?     : boolean;
};

const Message: React.FC<Props> = ({ type, who, name, data, dataId, datetime, meta }) => {
  return (
    <>
      { type !=="line" && <ChatBubbles type={type} who={who} name={name} data={data} datetime={datetime} meta={meta} /> }
      { type ==="line" && <ChatLine time={datetime} /> }
    </>
  )
}

export default Message