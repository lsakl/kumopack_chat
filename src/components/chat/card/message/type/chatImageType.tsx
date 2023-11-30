import React from 'react';
import { baseURL } from './../../../service/serviceChat'

type Props = {
  value : any;
};

const ChatImageType: React.FC<Props> = ({ value }) => {
  return (
    <div className="file-box p-2 card w-50">
      <img src={baseURL+value.url} alt={value.name} />
    </div>
  )
}

export default ChatImageType