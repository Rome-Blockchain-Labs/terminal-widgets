import React from 'react';

export const Footer = (props) => {
  return (
    <footer
      className="footer"
      style={{
        paddingBottom: '30px',
        paddingTop: '120px',
        textAlign: 'center',
      }}
    >
      &copy; 2022 RBL Velox All Right Reserved
      {/* <div className="footer__inner flex --align-center --just-center">
                <a href="1"
                    className="footer__link --svg__tg">Telegram</a>
                <a href="2"
                    className="footer__link --svg__m">M...</a>
                <a href="3"
                    className="footer__link --svg__twitter">Twitter</a>
            </div> */}
    </footer>
  );
};
