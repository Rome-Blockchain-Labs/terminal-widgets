import 'twin.macro'

import React from 'react'

import listDark from '../../assets/images/token-list/lists-dark.png'
import { PaddedColumn } from './styleds'
import { ButtonPrimary } from 'components/shared/buttons'
import { OutlineCard } from 'components/shared/card'
import Column, { AutoColumn } from 'components/shared/column'
import { ExternalLink } from 'react-feather'

export default function ListIntroduction({
  onSelectList,
}: {
  onSelectList: () => void
}) {
  return (
    <Column style={{ flex: '1 1', width: '100%' }}>
      <PaddedColumn>
        <AutoColumn gap="14px">
          <img
            alt="token-list-preview"
            src={listDark as unknown as string}
            style={{ margin: '0 auto', width: '120px' }}
          />
          <img
            alt="token-list-preview"
            src="https://cloudflare-ipfs.com/ipfs/QmRf1rAJcZjV3pwKTHfPdJh4RxR8yvRHkdLjZCsmp7T6hA"
            style={{ borderRadius: '12px', width: '100%' }}
          />
          <span tw="text-center mb-2 text-white text-xl">
            Uniswap now supports token lists. You can add your own custom lists
            via IPFS, HTTPS and ENS.{' '}
          </span>
          <ButtonPrimary
            id="list-introduction-choose-a-list"
            onClick={onSelectList}
          >
            Choose a list
          </ButtonPrimary>
          <OutlineCard style={{ marginBottom: '8px', padding: '1rem' }}>
            <span tw="text-center text-white text-xl">
              Token lists are an{' '}
              <ExternalLink href="https://github.com/uniswap/token-lists">
                open specification
              </ExternalLink>
              . Check out{' '}
              <ExternalLink href="https://tokenlists.org">
                tokenlists.org
              </ExternalLink>{' '}
              to learn more.
            </span>
          </OutlineCard>
        </AutoColumn>
      </PaddedColumn>
    </Column>
  )
}
