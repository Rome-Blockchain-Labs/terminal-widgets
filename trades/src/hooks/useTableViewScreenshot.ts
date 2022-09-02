import { getStorage, ref, uploadString } from 'firebase/storage';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useScreenshot } from 'use-react-screenshot';

import { addToWatchlist } from '../store/slices/app';
import { WidgetState } from '../types';
import { useIsMounted } from './useIsMounted';

const SCREENSHOT_WIDTH = 230;
const SCREENSHOT_HEIGHT = 90;
const WATERMARK_HEIGHT = 150; // Tradingview generates their logo at the bottom of a screenshot

export const useTableViewScreenshot = () => {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const [, takeScreenshot] = useScreenshot();

  const createScreenshot = (refObj: any) => {
    return new Promise<string | null>((resolve, reject) => {
      takeScreenshot(refObj).then((data: any) => {
        try {
          const img = new Image();
          img.src = data;
          img.onload = () => {
            const reducedCanvas = document.createElement('canvas');
            reducedCanvas.width = SCREENSHOT_WIDTH;
            reducedCanvas.height = SCREENSHOT_HEIGHT;
            const ctx = reducedCanvas.getContext('2d');
            ctx?.drawImage(
              img,
              0,
              0,
              img.width,
              img.height - WATERMARK_HEIGHT,
              0,
              0,
              SCREENSHOT_WIDTH,
              SCREENSHOT_HEIGHT
            );

            resolve(reducedCanvas.toDataURL('image/png'));
          };
        } catch {
          reject(null);
        }
      });
    });
  };

  const addTableToWatch = (widgetState: WidgetState, refObj: any) => {
    createScreenshot(refObj).then((img: any) => {
      if (img && isMounted.current) {
        try {
          const storage = getStorage();
          const storageRef = ref(storage, `${widgetState.uid}.json`);
          uploadString(
            storageRef,
            JSON.stringify({
              widget: widgetState,
            })
          ).then(() => {
            dispatch(
              addToWatchlist({
                preview: img,
                widget: widgetState,
              })
            );
          });
        } catch {
          toast.error(
            'Failed to add widget to the watch list! Please contact support team.',
            {
              autoClose: 5000,
              closeOnClick: true,
              draggable: false,
              hideProgressBar: true,
              pauseOnHover: false,
              position: 'bottom-center',
            }
          );
        }
      }
    });
  };

  return {
    addTableToWatch,
  };
};
