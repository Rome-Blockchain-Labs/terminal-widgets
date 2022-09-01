import React, { FC, memo } from 'react';

import { IIconProps, TransitionPath } from '.';

export const QuickswapIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 16.549}
      viewBox="0 0 15.358 16.549"
      width={width ?? 15.358}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M12.317 14.924c0-.079.063-.123.1-.179a4.353 4.353 0 0 0 .705-1.729 4.723 4.723 0 0 0 .052-1.169 5.172 5.172 0 0 0-.434-1.728 5.729 5.729 0 0 0-.664-1.142 5.945 5.945 0 0 0-.97-1.009 5.558 5.558 0 0 0-1.893-1.021 5.265 5.265 0 0 0-1.134-.234 1.413 1.413 0 0 0-.209-.019 3.11 3.11 0 0 1 .528.582c.015.022.049.047.026.076s-.049.005-.075 0l-.3-.069a3.229 3.229 0 0 1 .431.6c.012.021.041.045.014.07s-.043 0-.064-.012a9.342 9.342 0 0 0-1.677-.457 8.838 8.838 0 0 0-.874-.093 5.142 5.142 0 0 0-.79.012 5.453 5.453 0 0 0-1.743.417 3.589 3.589 0 0 0-.507.241c-.019.011-.039.03-.061 0a.453.453 0 0 0-.182.141.12.12 0 0 1 .068.056 2.181 2.181 0 0 0 1.19.776 3.92 3.92 0 0 0 .675.125 1.108 1.108 0 0 1-.178-.267.39.39 0 0 1 .08-.462 1.148 1.148 0 0 1 .575-.29 4.137 4.137 0 0 1 1.346-.094 5.452 5.452 0 0 1 1.077.183 3.108 3.108 0 0 1 .843.346.115.115 0 0 1 .017.017.051.051 0 0 1 .034.008 2.651 2.651 0 0 1 1.14 1.145 2.287 2.287 0 0 1 .219.8 2.354 2.354 0 0 1 0 .487 4.5 4.5 0 0 1-.16.734v.005a3.566 3.566 0 0 0 .457-.3c.115-.091.209-.2.323-.3.009-.07.073-.1.11-.151a1.47 1.47 0 0 0 .3-.629.709.709 0 0 1 .033-.092 3.026 3.026 0 0 1 .215.568 2.634 2.634 0 0 1 .089.842 3.31 3.31 0 0 1-.432 1.4 4.572 4.572 0 0 1-.928 1.136 5.368 5.368 0 0 1-1.055.739 5.9 5.9 0 0 1-1.456.556 5.567 5.567 0 0 1-.967.139 3.9 3.9 0 0 1-.47.013 1.511 1.511 0 0 1-.364-.037c-.053-.008-.11.019-.161-.019a4.032 4.032 0 0 1-.8-.163 5.32 5.32 0 0 1-1.392-.654 2.914 2.914 0 0 0-.3-.211v.024a5.445 5.445 0 0 0 .711.553 7.721 7.721 0 0 0 3.417 1.291 8.347 8.347 0 0 0 1.085.061c.074 0 .148 0 .221-.006l.162-.008a7.87 7.87 0 0 0 2.67-.641 5.491 5.491 0 0 0 .916-.581 1.913 1.913 0 0 0 .411-.377z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M9.519 11.686a3.684 3.684 0 0 0 .128-.618 2.735 2.735 0 0 1-.638.424 2.287 2.287 0 0 0-.22-2.4 3.426 3.426 0 0 0-.358-.378.086.086 0 0 0-.051-.028 1.907 1.907 0 0 1 .538 1.269 1.826 1.826 0 0 1-.255.961 3.255 3.255 0 0 1-1.286 1.226 4.576 4.576 0 0 1-1.762.557 4.706 4.706 0 0 1-3.073-.707 5.981 5.981 0 0 1-1.877-1.929 9.018 9.018 0 0 1-.6-1.146c-.022-.048-.028-.1-.049-.142.014.047.04.1-.012.15a7.742 7.742 0 0 0 2.58 5.6c.062.012.091.07.14.1.047-.019.076.015.107.038a5.062 5.062 0 0 0 1.743.847 6.147 6.147 0 0 0 .64.127.789.789 0 0 0 .151.018l.03.007c.066.007.132.009.2.013a4.882 4.882 0 0 0 1.713-.3 5.769 5.769 0 0 0 1.653-.93 4.274 4.274 0 0 0 1.182-1.411 2.717 2.717 0 0 0 .274-.967 2.359 2.359 0 0 0-.1-.858 2.862 2.862 0 0 1-.688.558c-.03.017-.062.049-.1.025h-.007v-.011c-.025-.029-.012-.066-.003-.095zM11.251 1.59a6.177 6.177 0 0 0 .224-1.57V.013a.012.012 0 0 0-.007-.012c-.067.024-.052.09-.067.138a5.769 5.769 0 0 1-.623 1.338c.153.062.3.127.453.2.009-.032.013-.06.02-.087z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M10.283 2.166c.014.031.044.018.067.027a2.117 2.117 0 0 1 .432-.1l-.156.205a4.711 4.711 0 0 1-2.007 1.553.136.136 0 0 0-.085.1 2.085 2.085 0 0 1-.535.9c-.013.012-.037.023-.017.053a.266.266 0 0 0 .035-.008 7.2 7.2 0 0 0 1.325-.685 3.387 3.387 0 0 1 .337-.232c-.006-.051.036-.068.066-.093a4.482 4.482 0 0 0 1.188-1.5 4.17 4.17 0 0 0 .218-.551.236.236 0 0 1 .08-.146v-.014a9.743 9.743 0 0 0-.454-.2 5.852 5.852 0 0 1-.5.691z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M10.934 2.384a4.484 4.484 0 0 1-1.188 1.5c-.03.025-.072.042-.066.093.019-.018.037-.038.058-.055a4.624 4.624 0 0 0 .923-1.012 4.916 4.916 0 0 0 .571-1.223.236.236 0 0 0-.081.146 4.075 4.075 0 0 1-.217.551z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M15.358 10.677a5.7 5.7 0 0 0-.557-2.209 5.9 5.9 0 0 0-.816-1.254 6.75 6.75 0 0 0-.981-.922c-.18-.114-.357-.234-.541-.341a5.625 5.625 0 0 0-1.936-.691.253.253 0 0 1-.044-.018 4.982 4.982 0 0 1 1.387.2 6.521 6.521 0 0 1 1.3.511 2.65 2.65 0 0 0-.171-.322.349.349 0 0 1-.077-.14c.034.012.064.033.1.048a.1.1 0 0 1 .02.01 1.713 1.713 0 0 1 .227.114 9.279 9.279 0 0 1 1.647 1.086l.117.063a6.586 6.586 0 0 0-1.1-1.086 8.075 8.075 0 0 0-1.56-.99 7.715 7.715 0 0 0-2.456-.737 1 1 0 0 1-.228-.026 3.523 3.523 0 0 0-.338.233 7.193 7.193 0 0 1-1.324.685l-.035.008c-.02-.03 0-.041.016-.053a2.086 2.086 0 0 0 .535-.9.134.134 0 0 1 .085-.1 4.707 4.707 0 0 0 2.005-1.553c.049-.063.1-.126.156-.2a2.094 2.094 0 0 0-.432.1l-.108.041c-.007-.043.021-.052.041-.068a5.747 5.747 0 0 0 .5-.692l-.269-.1a8.133 8.133 0 0 1-1.873 1.667 2.514 2.514 0 0 0-.146-.63l-.1-.217-.042-.056c-.03-.045-.051-.033-.07.009a2.054 2.054 0 0 1-.727.786 5.44 5.44 0 0 1-1.069.584 5.016 5.016 0 0 1-.544.221 1.558 1.558 0 0 0-.642.4 1.734 1.734 0 0 0-.2.307 1.043 1.043 0 0 0-.046.278.816.816 0 0 0 .037.241l.061.121a.694.694 0 0 0 .388.261c.032.011.063.018.113.032a.716.716 0 0 1-.621-.089.077.077 0 0 0-.052-.022 2.664 2.664 0 0 1-1.028.749.511.511 0 0 1-.077.017.458.458 0 0 1-.347.011.211.211 0 0 1-.16-.13.434.434 0 0 1-.037-.325l.058-.261c-.129.015-.2.124-.294.192-.15.107-.264.254-.4.374a3.51 3.51 0 0 0-.429.642 4.176 4.176 0 0 0-.162.484l-.038.24-.01.3.021.34c.037.172.06.347.1.519.023.105.057.08.111.035a2.649 2.649 0 0 1 .321-.25.455.455 0 0 1 .182-.141 5.349 5.349 0 0 1 1.588-.762 6.5 6.5 0 0 1 2.391-.227 8.774 8.774 0 0 1 1.227.187.594.594 0 0 1 .066.022l.3.069c.026.006.058.022.075 0s-.011-.054-.027-.076a3.094 3.094 0 0 0-.527-.582 4.248 4.248 0 0 0-.773-.481v-.027h.3a5.98 5.98 0 0 1 3.835 1.176 5.572 5.572 0 0 1 2.182 3.509 4.624 4.624 0 0 1-.631 3.472 2.675 2.675 0 0 1-.473.58 1.917 1.917 0 0 1-.414.39 5.606 5.606 0 0 1-.916.581 7.868 7.868 0 0 0 4.317-4.705 1.883 1.883 0 0 0 .054-.395zM3.398 6.889a.163.163 0 0 0-.171-.154.16.16 0 0 0-.047.009.631.631 0 0 0-.338.2 2.833 2.833 0 0 1-.079.076l-.044.056a.366.366 0 0 1 .039-.138.9.9 0 0 1 .364-.529.392.392 0 0 1 .157-.061.167.167 0 0 1 .2.123.4.4 0 0 1-.05.314c.015.04-.038.063-.032.1zm4.355-3.088a1.574 1.574 0 0 1-1.435 1.242 2.211 2.211 0 0 1-.421.016.4.4 0 0 1 .094-.391 1.043 1.043 0 0 1 .4-.287 7.383 7.383 0 0 1 .714-.279 3.058 3.058 0 0 0 .62-.347c.007-.015.024-.037.031-.029.027.023.017.052-.006.075z"
        fill={active ? activeColor : color}
      />
    </svg>
  )
);
