import React, { HTMLProps, useCallback } from 'react';
import tw, { styled } from 'twin.macro';

const StyledLink = styled.a`
  ${tw`no-underline cursor-pointer text-yellow-400 font-medium text-xl`}

  :hover {
    ${tw`no-underline `}
  }

  :focus {
    ${tw`no-underline outline-none`}
  }
`;

/**
 * Outbound link that handles firing google analytics events
 */
export const ExternalLink = ({
  href,
  rel = 'noopener noreferrer',
  target = '_blank',
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & {
  href: string;
}) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // don't prevent default, don't redirect if it's a new tab
      if (target === '_blank' || event.ctrlKey || event.metaKey) {
      } else {
        event.preventDefault();
        // send a ReactGA event and then trigger a location change

        window.location.href = href;
      }
    },
    [href, target]
  );
  return (
    <StyledLink
      href={href}
      rel={rel}
      target={target}
      onClick={handleClick}
      {...rest}
    />
  );
};
