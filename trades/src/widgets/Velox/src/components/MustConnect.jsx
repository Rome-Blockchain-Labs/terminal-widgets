import React from 'react';

import connectButtonImg from '../assets/icons/icon-connect-wallet-dark-green.svg';

const MustConnect = (props) => {
  const { text } = props;
  return (
    <div
      style={{
        alignItems: 'center',
        background: '#08333C',
        borderRadius: '30px',
        boxShadow:
          ' rgba(34, 178, 177, 0.5) 4px 0px 4px 0px, rgba(34, 178, 177, 0.5) 0px 4px 4px 0px',
        display: 'flex',
        flexDirection: 'column',
        height: '300px',
        justifyContent: 'center',
        marginTop: '40px',
        padding: '50px',
        width: '100%',
      }}
    >
      <h6>{text}</h6>
      <img
        alt="Connect Wallet"
        id="veloxlogo"
        src={connectButtonImg}
        width="40"
      />
    </div>
  );
};
export default MustConnect;
