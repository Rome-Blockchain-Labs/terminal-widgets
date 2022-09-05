import { Tooltip, withStyles } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

export const SmallSpinner = () => <div color="light" size={'sm'} />;

export const PinkTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: 'rgba(237, 18, 122, 0.9)',
    fontSize: '11px',
  },
}))(Tooltip);

export const SmallError = ({ error, retry }) => {
  if (typeof retry === 'function') {
    return (
      <Tooltip id="mark" title={'Something went wrong, click to retry'}>
        <ErrorOutlineIcon
          style={{ color: '#A06A86', cursor: 'Pointer' }}
          onClick={retry}
        />
      </Tooltip>
    );
  }
  return <ErrorOutlineIcon style={{ color: '#A06A86' }} />;
};
