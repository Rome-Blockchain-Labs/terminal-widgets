import React from 'react';
import { styled } from 'twin.macro';

export const BodyWrapper = styled.div`
  position: relative;

  width: 100%;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 8px;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  margin-top: 20px;
`;

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <BodyWrapper className={className}>{children}</BodyWrapper>;
}