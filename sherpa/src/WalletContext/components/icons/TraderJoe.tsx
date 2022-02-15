import React, { FC, memo } from 'react'

import { IIconProps, SVG, TransitionPath } from '.'

export const TraderJoeIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <SVG
      height={height ?? 18.475}
      hoverColor={activeColor}
      viewBox="0 0 13.323 18.475"
      width={width ?? 13.323}
      xmlns="http://www.w3.org/2000/svg"
    >
      <TransitionPath
        d="M13.237 13.513c.026.052.078.1.078.151.009.484.009.964 0 1.448a.3.3 0 0 1-.125.216c-.8.475-1.616.942-2.429 1.4-.03.017-.086 0-.13-.009a1.048 1.048 0 0 0 .052-.216v-1.474c.095-.061.19-.13.289-.186.519-.29 1.042-.566 1.556-.86.242-.134.471-.31.709-.47zm-2.904 3.056c.065.393-.2.532-.488.687-.722.4-1.431.813-2.144 1.219v-1.461a1.27 1.27 0 0 0-.043-.251c.2-.112.411-.22.614-.337.514-.294 1.029-.588 1.534-.89a3.707 3.707 0 0 0 .359-.285c.151-.009.125.1.13.19.015.371.025.752.038 1.128z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M7.658 16.763a2.527 2.527 0 0 1 .043.251v1.461c-.311-.169-.631-.333-.938-.514a369.832 369.832 0 0 1-2.718-1.586 1.9 1.9 0 0 1 .182-.143l.886-.519.64.324c.117.069.233.138.346.207.074.039.147.082.22.121l.557.311c.078-.039.151-.082.229-.121.056-.022.112-.039.164-.061.13.092.259.178.389.269zm5.579-3.25c-.238.16-.462.333-.709.471-.514.294-1.037.575-1.556.86-.1.056-.194.125-.289.186-.164-.078-.328-.151-.493-.229l1.115-.674a.023.023 0 0 0 .021-.009l.138-.078c.026-.017.056-.03.082-.048.393-.229.782-.458 1.176-.683.022-.009.047-.013.069-.022l.1.013.06.013c.1.066.191.135.286.2zm-3.042 1.292c.164.078.328.151.493.229v1.474a.931.931 0 0 1-.052.216l-.3-.156-.039-1.132c0-.091.022-.2-.13-.19-.112-.073-.22-.151-.333-.225.119-.073.24-.147.361-.216z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M9.832 15.021c.112.073.22.151.333.225a3.237 3.237 0 0 1-.359.285c-.51.3-1.02.6-1.534.89-.2.117-.411.225-.614.337-.13-.086-.259-.177-.389-.264.017-.022.034-.048.052-.069.056-.03.112-.065.169-.1.3-.177.605-.35.908-.527a1.618 1.618 0 0 0 .151-.073c.427-.224.854-.466 1.283-.704zM.071 3.592c.375-.22.7-.415 1.031-.605 1.65-.95 3.305-1.892 4.947-2.856a.652.652 0 0 1 .772-.009c1.4.835 2.808 1.645 4.216 2.462.506.294 1.015.582 1.523.874.072.042.143.087.242.148L6.424 7.278zm11.51 9.432-.2.282-.194.266-.269-.12-.82 1.245-.841-.288.125.41c-.253-.1-.47.045-.7-.048a.461.461 0 0 0-.5.036c-.119.086-.348.028-.527.017a1.936 1.936 0 0 1-.375-.067.787.787 0 0 0-.814.146c-.192-.115-.375-.219-.552-.331a.467.467 0 0 0-.563-.045c-.037.025-.106 0-.234 0l.254-.228c-.007-.021-.006-.05-.019-.057-.3-.179-.607-.35-.906-.535a.4.4 0 0 0-.518.076c.071.131.141.257.208.386a3.351 3.351 0 0 1 .153.315.12.12 0 0 1-.045.1.119.119 0 0 1-.114 0 1.432 1.432 0 0 1-.173-.226c-.1-.152-.184-.308-.282-.474l-.628.265c-.111.047-.206.053-.264-.129l.729-.37c-.042-.223-.315-.36-.185-.608L2.1 12.293a3.158 3.158 0 0 1 .048-1.1c.1-.348.191-.7.278-1.048a1.5 1.5 0 0 0 .036-.347v-1.63a.461.461 0 0 1 .379-.467.312.312 0 0 1 .178.043c.17.089.331.194.5.277a.317.317 0 0 1 .172.341c-.005.522 0 1.044 0 1.566a.549.549 0 0 0 .131.379q1.267 1.542 2.528 3.089c.006.007.018.009.053.025 0-.084.012-.161.012-.238v-2.589a4.716 4.716 0 0 0-.041-.54.414.414 0 0 1 .212-.458l1.056-.6a.274.274 0 0 1 .3-.014c.528.3 1.059.586 1.654.915l-.782.463v.939a2.721 2.721 0 0 0 .749-.418c.053-.038.07-.149.073-.228.01-.212 0-.424 0-.666l.3.136a8.484 8.484 0 0 1 1.328-1.042c.1.258 0 .519.082.788.243-.139.476-.259.693-.4a.368.368 0 0 0 .128-.232 1.474 1.474 0 0 0 0-.414.3.3 0 0 1 .241-.355c.119-.042.237-.089.388-.146v1.4c.047.042.069.064.093.083.139.106.394.125.4.324.011.328.112.673-.132.982-.356.45-.688.918-1.032 1.377a.377.377 0 0 1-.243.178z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M12.098 6.434c.127-.076.234-.145.346-.206s.206-.1.357-.176c0 .219.013.4 0 .572a.378.378 0 0 0 .246.43 1.607 1.607 0 0 1 .2.124c-.081.132-.211.145-.325.186a6.74 6.74 0 0 0-1.663.8c-.363.258-.71.54-1.06.815-.119.093-.221.2-.393.1-.633-.371-1.269-.735-1.947-1.127a4.259 4.259 0 0 1 .327-.338 8.062 8.062 0 0 1 1.927-1.238c.323-.138.653-.258.976-.394a.316.316 0 0 1 .3.048c.229.125.459.258.709.404zm-9.044 8.68c-.2-.017-.2-.192-.288-.3s-.191-.227-.294-.349l-.508.1c.032-.222.223-.243.357-.377-.126-.221-.206-.478-.351-.71-.191-.3-.363-.621-.543-.931-.11-.189-.219-.38-.334-.566-.079-.127-.19-.1-.309-.059a1.85 1.85 0 0 1-.269.072c-.013 0-.032-.024-.076-.059l.6-.355c.669 1.198 1.469 2.29 2.015 3.534zm-.388 1.917c-.667-.375-1.314-.78-2-1.119a.8.8 0 0 1-.524-.929 9.254 9.254 0 0 0 .031-1.068l.19.015 1.13.667c.154.082.3.169.457.252.236.139.477.272.714.411l.015.077c-.002.57-.008 1.13-.013 1.694z"
        fill={active ? activeColor : color}
      />
      <TransitionPath
        d="M2.667 17.031c.005-.565.01-1.124.01-1.689.257.123.508.252.765.375l.37-.246c.067-.031.134-.067.2-.1l.56-.313a2.57 2.57 0 0 1 .205-.1c.133-.051.262-.1.4-.149.005.067.005.134.01.2v.252c-.015.118-.031.236-.041.354-.349.205-.7.406-1.052.616a2.227 2.227 0 0 0-.216.169c-.359.19-.719.385-1.073.575-.047.024-.093.036-.138.056zM.128 13.298A.128.128 0 0 1 0 13.17V3.725a.128.128 0 0 1 .128-.128.128.128 0 0 1 .128.128v9.441a.128.128 0 0 1-.128.132zm12.631-7.773a.128.128 0 0 1-.128-.128V3.725a.128.128 0 0 1 .128-.128.128.128 0 0 1 .128.128v1.668a.128.128 0 0 1-.128.132z"
        fill={active ? activeColor : color}
      />
    </SVG>
  )
)