import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';

import {
  toastClearError,
  toastClearSuccess,
} from '../../redux/userFeedback/userFeedbackSlice';

function Toasts() {
  const dispatch = useDispatch();
  const {
    errorToastMessage,
    errorToastOpen,
    successToastMessage,
    successToastOpen,
  } = useSelector((state) => state?.velox?.userFeedback);
  return (
    <>
      <Snackbar
        autoHideDuration={5000}
        open={errorToastOpen}
        onClose={() => dispatch(toastClearError())}
      >
        <Alert severity="warning" onClose={() => dispatch(toastClearError())}>
          {errorToastMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        autoHideDuration={5000}
        open={successToastOpen}
        onClose={() => dispatch(toastClearSuccess())}
      >
        <Alert severity="success" onClose={() => dispatch(toastClearSuccess())}>
          {successToastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Toasts;
