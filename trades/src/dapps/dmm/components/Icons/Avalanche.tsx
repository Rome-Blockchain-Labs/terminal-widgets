import React from 'react';

function Avalanche({ size }: { size?: number }) {
  return (
    <svg
      fill="none"
      height={size || 36}
      viewBox="0 0 36 36"
      width={size || 36}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.24465 33.4928C4.76123 33.4928 3.27782 33.4968 1.79441 33.4928C1.11273 33.4885 0.490453 33.3583 0.146549 32.6619C-0.109159 32.1475 -0.00166985 31.667 0.257407 31.2015C0.978595 29.9049 1.7007 28.6089 2.43414 27.319C6.81945 19.6078 11.2068 11.8977 15.5962 4.18864C15.7622 3.89741 15.9306 3.60679 16.1168 3.32934C16.8398 2.25568 17.9732 2.24312 18.6757 3.33639C19.2444 4.22141 19.7494 5.14778 20.2718 6.0619C21.2533 7.77958 22.225 9.50247 23.2068 11.2211C24.1001 12.7844 24.1029 14.341 23.2102 15.9065C20.3095 20.9929 17.4105 26.0802 14.513 31.1684C13.6063 32.7584 12.2218 33.5044 10.4076 33.4958C9.02007 33.4866 7.63251 33.4928 6.24465 33.4928Z" />
      <path d="M28.6092 33.4941C26.8232 33.4941 25.0373 33.4968 23.2501 33.491C22.9793 33.4917 22.709 33.4686 22.4422 33.4221C21.5471 33.2598 21.051 32.3944 21.3768 31.543C21.5073 31.2025 21.6907 30.8794 21.8741 30.5631C23.5699 27.6367 25.2691 24.7124 26.9718 21.7903C27.1217 21.5269 27.2869 21.2725 27.4666 21.0284C28.0923 20.1945 29.1525 20.1819 29.7735 21.0106C30.0308 21.3539 30.2494 21.7284 30.4668 22.0999C32.1177 24.923 33.7651 27.7481 35.4092 30.5753C35.5929 30.8917 35.7718 31.2169 35.901 31.5577C36.2238 32.4082 35.7243 33.28 34.8218 33.4206C34.368 33.4913 33.901 33.4922 33.4401 33.4947C31.8293 33.5026 30.2188 33.4977 28.608 33.4977L28.6092 33.4941Z" />
    </svg>
  );
}

export default Avalanche;
