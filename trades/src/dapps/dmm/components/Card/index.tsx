import React from 'react';
import { CardProps, Text } from 'rebass';
import { Box } from 'rebass/styled-components';
import tw, { styled } from 'twin.macro';

const Card = styled(Box)<{
  padding?: string;
  border?: string;
  borderRadius?: string;
}>`
  width: 100%;
  border-radius: 16px;
  padding: 1.25rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`;
export default Card;

export const BlackCard = styled(Card)`
  ${tw`bg-dark-600 rounded-xl`}
`;

export const LightCard = styled(Card)``;

export const LightGreyCard = styled(Card)``;

export const GreyCard = styled(Card)`
  ${tw`bg-gray-700 text-xl text-gray-400`}
`;

export const OutlineCard = styled(Card)``;

export const YellowCard = styled(Card)`
  background-color: rgba(243, 132, 30, 0.05);
  font-weight: 500;
`;

export const PinkCard = styled(Card)`
  background-color: rgba(255, 0, 122, 0.03);

  font-weight: 500;
`;

const BlueCardStyled = styled(Card)`
  border-radius: 12px;
  width: fit-content;
  ${tw`bg-green-400 bg-opacity-20`}
`;

export const BlueCard = ({ children, ...rest }: CardProps) => {
  return (
    <BlueCardStyled {...rest}>
      <Text fontWeight={500}>{children}</Text>
    </BlueCardStyled>
  );
};
