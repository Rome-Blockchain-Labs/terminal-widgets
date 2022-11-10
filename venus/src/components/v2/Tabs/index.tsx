/** @jsxImportSource @emotion/react */
import React, { ReactElement, useState } from 'react';

import useStyles from './styles';
import { MarketButton, TertiaryButton } from '../Button/index';

type Tab = {
  title: string;
  content: ReactElement;
};

export interface ITabsProps {
  tabsContent: Tab[];
  componentTitle?: string;
  initialActiveTabIndex?: number;
  onTabChange?: (newIndex: number) => void;
  className?: string;
  isMarket?: boolean;
}

export const Tabs = ({
  tabsContent,
  initialActiveTabIndex = 0,
  onTabChange,
  className,
  componentTitle,
  isMarket,
}: ITabsProps) => {
  const styles = useStyles();
  const [activeTabIndex, setActiveTabIndex] = useState(initialActiveTabIndex);
  const TabButton = isMarket ? MarketButton : TertiaryButton;

  const handleChange = (index: number) => {
    setActiveTabIndex(index);
    // Only call onTabChange callback if tab clicked isn't currently active
    if (index !== activeTabIndex && onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <>
      <div
        css={styles.getContainer({
          hasTitle: !!componentTitle,
        })}
        className={className}
      >
        {componentTitle && (
          <div css={[styles.headerTitle]}>
            <h4>{componentTitle}</h4>
          </div>
        )}
        {tabsContent.map(({ title }, index) => (
          <TabButton
            key={title}
            onClick={() => handleChange(index)}
            css={styles.getButton({
              active: index === activeTabIndex,
              last: index === tabsContent.length - 1,
              fullWidth: !componentTitle,
              isMarket,
            })}
          >
            {title}
          </TabButton>
        ))}
      </div>
      {tabsContent[activeTabIndex].content}
    </>
  );
};
