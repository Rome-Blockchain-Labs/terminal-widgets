import React, { FC, memo } from 'react'

import { IIconProps, TransitionCircle, TransitionPath } from '.'

export const SnowTraceIcon: FC<IIconProps> = memo(
  ({ active, activeColor, color, height, width }) => (
    <svg
      height={height ?? 20}
      viewBox="0 0 151.075 151.075"
      width={width ?? 20}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(-1186.167 -750.463)">
        <TransitionCircle
          cx="75.537"
          cy="75.537"
          data-name="Ellipse 13"
          fill="#e84142"
          r="75.537"
          transform="translate(1186.167 750.463)"
        />
        <g data-name="Group 56" fill="#fff">
          <TransitionPath
            d="M1269.906 830.92c.012-.085.026-.171.036-.256s.017-.174.024-.26a9.86 9.86 0 0 0 .031-.481c0-.071 0-.141.005-.211 0-.051.006-.1.006-.151v-.094c0-.178-.01-.356-.022-.534 0-.039-.005-.076-.008-.115l-.008-.088a7.912 7.912 0 0 0-.017-.225c-.02-.175-.046-.348-.075-.521l-.01-.054-.026-.142c-.015-.082-.027-.163-.044-.242a8.94 8.94 0 0 0-.115-.463l-.022-.076-.027-.1c-.029-.1-.055-.2-.087-.3-.041-.128-.088-.255-.135-.385-.021-.056-.044-.112-.066-.167-.046-.116-.088-.234-.138-.348s-.095-.207-.144-.31c-.039-.08-.08-.158-.12-.236-.051-.1-.1-.2-.156-.3-.025-.046-.046-.093-.071-.139s-.06-.087-.087-.132c-.058-.1-.12-.19-.182-.285a8.199 8.199 0 0 0-.344-.505c-.07-.094-.154-.195-.231-.291-.039-.046-.073-.1-.112-.141-.088-.105-.175-.21-.266-.312-.07-.076-.145-.147-.215-.222l-.073-.076-.052-.054c-.114-.112-.227-.224-.346-.331a4.143 4.143 0 0 0-.19-.161l-.11-.095-.039-.034c-.136-.11-.273-.219-.414-.324-.061-.044-.126-.087-.188-.131l-.073-.049-.093-.064c-.148-.1-.3-.2-.451-.285-.027-.017-.053-.036-.08-.052-.046-.026-.1-.046-.141-.072l-.176-.1a8.737 8.737 0 0 0-.674-.324c-.088-.037-.158-.065-.236-.1-.108-.043-.217-.088-.329-.127h-.009v-35.093h-6.556v9.886l-6.714-6.712-4.636 4.636 11.35 11.349v15.934h-.013c-.109.041-.217.084-.326.127-.078.031-.156.062-.234.1s-.176.08-.265.121a9.25 9.25 0 0 0-.411.205c-.059.032-.117.063-.175.1s-.095.046-.141.072c-.029.017-.054.038-.083.052-.153.092-.3.187-.449.285l-.092.062-.035.026c-.075.051-.15.1-.223.152-.142.106-.281.216-.419.33l-.037.032-.036.029-.032.027-13.8-7.966-4.154-15.5-6.334 1.7 2.458 9.172-8.564-4.946-3.279 5.678 8.563 4.945-9.171 2.456 1.7 6.335 15.5-4.155 13.8 7.966-.043.239c-.02.139-.039.279-.054.42-.009.071-.012.142-.019.214-.01.115-.022.23-.027.346-.007.134-.01.27-.01.4 0 .033-.005.063-.005.094s.005.061.005.094c0 .134 0 .268.01.4l.027.351c.007.071.01.142.019.214.015.137.032.275.054.413.012.081.029.163.043.244l-13.8 7.967-15.5-4.155-1.7 6.333 9.171 2.458-8.563 4.942 3.279 5.681 8.564-4.946-2.458 9.171 6.334 1.7 4.154-15.5 13.8-7.966.036.029.024.021.051.042c.136.111.271.22.414.323.073.055.149.1.224.156l.025.017c.036.023.07.049.107.073.144.1.292.191.443.279.029.017.054.038.083.053.056.034.115.061.173.093s.09.048.134.071l.056.031c.088.046.175.093.265.136.138.068.277.128.416.189l.042.019c.087.038.173.069.261.1l.141.053.076.029v15.929l-11.35 11.351 4.636 4.636 6.714-6.714v9.888h6.556v-9.888l6.713 6.714 4.637-4.636-11.349-11.351v-15.929l.075-.029.143-.053c.086-.034.173-.065.259-.1l.046-.021c.137-.06.275-.12.411-.186.091-.045.18-.092.268-.139l.052-.028c.046-.025.092-.048.138-.074s.115-.06.173-.092c.027-.015.052-.036.08-.053.151-.088.3-.181.444-.278l.108-.077.026-.017c.074-.05.149-.1.222-.154.141-.1.278-.212.414-.322l.053-.046.024-.021.034-.027 13.8 7.966 4.155 15.5 6.333-1.7-2.458-9.171 8.563 4.946 3.279-5.681-30.392-17.545c.015-.129.034-.247.049-.366Z"
            data-name="Path 137"
          />
          <TransitionPath
            d="M1286.791 831.003a15.822 15.822 0 0 0-13.8-23.552v6.556a9.267 9.267 0 0 1 8.083 13.786Z"
            data-name="Path 138"
          />
          <TransitionPath
            d="M1269.205 785.27v6.556a32.514 32.514 0 0 1 27.833 49.309l5.61 3.394a39.071 39.071 0 0 0-33.443-59.259Z"
            data-name="Path 139"
          />
        </g>
      </g>
    </svg>
  )
)
