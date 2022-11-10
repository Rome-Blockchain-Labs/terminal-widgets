/** @jsxImportSource @emotion/react */
import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'translation';

import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities/common';
import { IToggleProps, Toggle, Icon, Tooltip, BorrowLimitUsedAccountHealth } from 'components';
import { useMyAccountStyles as useStyles } from './styles';
import { useIsSmDown } from '../../../hooks/responsive';

export interface IMyAccountUiProps {
  netApyPercentage: number | undefined;
  dailyEarningsCents: number | undefined;
  supplyBalanceCents: number | undefined;
  borrowBalanceCents: number | undefined;
  borrowLimitCents: number | undefined;
  safeBorrowLimitPercentage: number;
  isXvsEnabled: boolean;
  onXvsToggle: (newValue: boolean) => void;
  className?: string;
}

export const MyAccountUi = ({
  netApyPercentage,
  dailyEarningsCents,
  supplyBalanceCents,
  borrowBalanceCents,
  borrowLimitCents,
  safeBorrowLimitPercentage,
  isXvsEnabled,
  onXvsToggle,
  className,
}: IMyAccountUiProps) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const isSmDown = useIsSmDown();

  const handleXvsToggleChange: IToggleProps['onChange'] = (_event, checked) => onXvsToggle(checked);

  const safeBorrowLimitCents =
    typeof borrowLimitCents === 'number'
      ? Math.floor((borrowLimitCents * safeBorrowLimitPercentage) / 100)
      : undefined;

  const readableSafeBorrowLimit = formatCentsToReadableValue({
    value: safeBorrowLimitCents,
  });

  const readableNetApyPercentage = formatToReadablePercentage(netApyPercentage);

  const readableBorrowBalance = formatCentsToReadableValue({
    value: borrowBalanceCents,
  });

  const readableDailyEarnings = formatCentsToReadableValue({
    value: dailyEarningsCents,
  });

  const readableSupplyBalance = formatCentsToReadableValue({
    value: supplyBalanceCents,
  });

  return (
    <Grid container css={styles.container} className={className}>
      <Grid container xs={12} css={[styles.row, styles.header]}>
        <Grid item xs={9}>
          <Typography variant="h4">{t('myAccount.title')}</Typography>
        </Grid>
        {!isSmDown && (
          <Grid item xs={3} css={styles.apyWithXvs}>
            <Typography variant="small2" component="span" css={styles.apyWithXvsLabel}>
              {t('myAccount.apyWithXvs')}
            </Typography>

            <Toggle css={styles.toggle} value={isXvsEnabled} onChange={handleXvsToggleChange} />
          </Grid>
        )}
      </Grid>
      <Grid container spacing={2} mb={4}>
        <Grid item xs={4} sm={3} css={styles.netApyContainer}>
          <div css={styles.netApy}>
            <Typography component="span" variant="small2" css={styles.netApyLabel}>
              {t('myAccount.netApy')}
            </Typography>

            <Tooltip css={styles.tooltip} title={t('myAccount.netApyTooltip')}>
              <Icon css={styles.infoIcon} name="info" />
            </Tooltip>
          </div>

          <Typography variant="h2" color="interactive.success" component="span">
            {readableNetApyPercentage}
          </Typography>
        </Grid>

        <Grid item xs={4} sm={3} css={styles.item}>
          <Typography component="span" variant="small2" css={styles.labelListItem}>
            {t('myAccount.dailyEarnings')}
          </Typography>

          <Typography variant="h2" component="span">
            {readableDailyEarnings}
          </Typography>
        </Grid>

        {isSmDown && (
          <Grid item xs={4} css={styles.apyWithXvs}>
            <Typography variant="small2" component="span" css={styles.apyWithXvsLabel}>
              {t('myAccount.apyWithXvs')}
            </Typography>

            <Toggle css={styles.toggle} value={isXvsEnabled} onChange={handleXvsToggleChange} />
          </Grid>
        )}
        <Grid item xs={4} sm={3} css={styles.item}>
          <Typography component="span" variant="small2" css={styles.labelListItem}>
            {t('myAccount.supplyBalance')}
          </Typography>

          <Typography variant="h2" component="span">
            {readableSupplyBalance}
          </Typography>
        </Grid>

        <Grid item xs={4} sm={3} css={styles.item}>
          <Typography component="span" variant="small2" css={styles.labelListItem}>
            {t('myAccount.borrowBalance')}
          </Typography>

          <Typography variant="h2" component="span">
            {readableBorrowBalance}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <BorrowLimitUsedAccountHealth
          css={styles.progressBar}
          borrowBalanceCents={borrowBalanceCents}
          safeBorrowLimitPercentage={safeBorrowLimitPercentage}
          borrowLimitCents={borrowLimitCents}
        />

        <div css={styles.bottom}>
          <Icon name="shield" css={styles.shieldIcon} />

          <Typography component="span" variant="small2" css={styles.inlineLabel}>
            {t('myAccount.safeLimit')}
          </Typography>

          <Typography component="span" variant="small1" color="text.primary" css={styles.safeLimit}>
            {readableSafeBorrowLimit}
          </Typography>

          <Tooltip
            css={styles.tooltip}
            title={t('myAccount.safeLimitTooltip', { safeBorrowLimitPercentage })}
          >
            <Icon css={styles.infoIcon} name="info" />
          </Tooltip>
        </div>
      </Grid>
    </Grid>
  );
};

export default MyAccountUi;
