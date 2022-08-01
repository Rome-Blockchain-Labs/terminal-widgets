import styled from 'styled-components/macro';
import tw from 'twin.macro';

import { UniswapPage } from '../../App';
import { usePageContext } from '../../PageContext';

const TabContainer = styled.div`
  ${tw`z-10 text-black fixed  bottom-8 left-0 right-0 mx-auto md:bottom-auto md:right-auto w-1/2 md:left-8 md:top-5 lg:left-0 lg:mx-auto  lg:right-0  grid grid-cols-2 rounded-full bg-gray-400 h-11 px-1 gap-x-2 max-w-xs`}
`;

const Tab = styled.button<{ active: boolean }>`
  ${tw`grid place-items-center my-1 rounded-full`}

  ${({ active }) => (active ? tw`bg-yellow-100` : tw`bg-none text-[#d3d3d3]`)}
`;

export function SwapPoolTabs() {
  const { page, setPage } = usePageContext();
  return (
    <TabContainer>
      <Tab
        active={page === UniswapPage.SWAP}
        disabled={page === UniswapPage.SWAP}
        onClick={() => setPage(UniswapPage.SWAP)}
      >
        Swap
      </Tab>

      <Tab
        active={page !== UniswapPage.SWAP}
        disabled={page !== UniswapPage.SWAP}
        onClick={() => setPage(UniswapPage.POOL)}
      >
        Pool
      </Tab>
    </TabContainer>
  );
}
