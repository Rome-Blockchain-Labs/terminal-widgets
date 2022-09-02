import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { keyBy } from 'lodash';
import { ControlPosition } from 'react-draggable';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import {
  ExchangeType,
  getBasePairByNetworkExchange,
  NetworkName,
} from '../../constants/networkExchange';
import {
  AddWidgetState,
  EnlargementState,
  MobileMenuWidgetAction,
  Pair,
  WidgetEnlargementStatus,
  WidgetState,
  WidgetToolbar,
  WidgetType,
} from '../../types';
import { getKeyFromWidget, isPairEqual } from '../../utils';
import { MakeOptional } from '../../utils/customTypes';

const WIDGET_LIMIT_COUNT = 9;
const DEFAULT_WIDGETS: WidgetState[] = [
  {
    blockchain: NetworkName.AVALANCHE,
    enlargement: WidgetEnlargementStatus.NONE,
    exchangeType: ExchangeType.TRADERJOE,
    pair: getBasePairByNetworkExchange(
      NetworkName.AVALANCHE,
      ExchangeType.TRADERJOE
    ),
    targetPosition: 0,
    type: WidgetType.TRANSACTIONS,
    uid: uuidv4(),
    width: 0,
  },
  {
    blockchain: NetworkName.AVALANCHE,
    enlargement: WidgetEnlargementStatus.NONE,
    exchangeType: ExchangeType.TRADERJOE,
    isTable: true,
    pair: getBasePairByNetworkExchange(
      NetworkName.AVALANCHE,
      ExchangeType.TRADERJOE
    ),
    targetPosition: 1,
    type: WidgetType.TRANSACTIONS,
    uid: uuidv4(),
    width: 0,
  },
];

type WatchWidget = {
  widget: WidgetState;
  preview: string; // TODO: This is base64 image string.. need to change to server url
};
type SocialModal = {
  URL: string | undefined;
  hashtags: string | undefined;
};

type State = {
  draggingItemId: string;
  draggedItemId: string;
  widgets: WidgetState[];
  cursorPositionAtDrop: ControlPosition | null;
  preferredTokens: Pair[];
  isExtraWidgetsVisible: boolean;
  isMobileTokenDetailVisible: boolean;
  isMainMenuVisible: boolean;
  mobileNetwork: NetworkName;
  widgetsPerRow: number;
  watchingWidgets?: {
    [uid: string]: WatchWidget;
  };
  aboutUsModalVisibility: boolean;
  faqModalVisibility: boolean;
  widgetChangeStatus: MobileMenuWidgetAction;
  watchWidgetStatus: MobileMenuWidgetAction;
  widgetGridLayout: '1col' | '2col' | '3col';
  widgetWidth: number | undefined;
  socialModal: SocialModal | undefined;
  walletModalVisibility: boolean;
};

const initialState: State = {
  aboutUsModalVisibility: false,
  cursorPositionAtDrop: null,
  draggedItemId: '',
  draggingItemId: '',
  faqModalVisibility: false,
  isExtraWidgetsVisible: false,
  isMainMenuVisible: false,
  isMobileTokenDetailVisible: false,
  mobileNetwork: NetworkName.AVALANCHE,
  preferredTokens: [],
  socialModal: undefined,
  walletModalVisibility: false,
  watchWidgetStatus: MobileMenuWidgetAction.INIT,
  widgetChangeStatus: MobileMenuWidgetAction.INIT,
  widgetGridLayout: '2col',
  widgetWidth: 0,
  widgets: DEFAULT_WIDGETS,
  widgetsPerRow: 2,
};

const uppercaseAllWords = (type: string) =>
  type
    .toLowerCase()
    .replace('_', ' ')
    .split(' ')
    .map((word) => word.replace(/^./, (str) => str.toUpperCase()))
    .join(' ');

const slice = createSlice({
  initialState,
  name: 'app',
  reducers: {
    addChartWidget: (
      state,
      action: PayloadAction<{
        widget: MakeOptional<AddWidgetState, 'blockchain'>;
        chartData: any;
        interval?: string;
      }>
    ) => {
      if (state.widgets.length >= WIDGET_LIMIT_COUNT) {
        toast(
          `🦄 The dashboard only supports ${WIDGET_LIMIT_COUNT} active widgets.`,
          {
            autoClose: 5000,
            closeOnClick: true,
            draggable: false,
            hideProgressBar: true,
            pauseOnHover: true,
            position: 'top-center',
          }
        );
      } else {
        const widgetId = uuidv4();

        state.widgets.push({
          ...action.payload.widget,
          targetPosition: state.widgets.length,
          uid: widgetId,
        } as WidgetState);
      }
    },
    addPreferredToken: (state, action: PayloadAction<Pair>) => {
      if (
        !state.preferredTokens.find((pair) => isPairEqual(pair, action.payload))
      ) {
        state.preferredTokens.push(action.payload);
      }
    },
    addToWatchlist: (state, action: PayloadAction<WatchWidget>) => {
      if (!state.watchingWidgets) {
        state.watchingWidgets = {};
      }
      const key = getKeyFromWidget(action.payload.widget);
      state.watchingWidgets[key] = action.payload;
      state.watchWidgetStatus = MobileMenuWidgetAction.ADDED;
    },
    addWidget: (
      state,
      action: PayloadAction<MakeOptional<AddWidgetState, 'blockchain'>>
    ) => {
      if (action.payload.type == null) return;
      let errorMessage = null;
      if (action.payload.disableDuplication) {
        const sameTypeWidgets = state.widgets.filter(
          (widget) =>
            widget.type === action.payload.type &&
            widget.blockchain === action.payload.blockchain
        );

        if (sameTypeWidgets.length > 0) {
          const formattedWidgetType = uppercaseAllWords(action.payload.type);
          errorMessage = `🦄 ${formattedWidgetType} is already open on your dashboard`;
        }
      } else {
        const disallowAnotherOpen = state.widgets.some(
          (widget) =>
            !(widget.type === 'transactions') && //allow multiple instances of the transactions widget so the same pair can be opened
            widget.type === action.payload.type &&
            widget.isTable === action.payload.isTable &&
            widget.exchangeType === action.payload.exchangeType &&
            widget.pair?.address === action.payload.pair?.address
        );
        if (disallowAnotherOpen) {
          errorMessage = 'The widget is already open on your dashboard';
        }
      }
      if (errorMessage) {
        toast(errorMessage, {
          autoClose: 5000,
          closeOnClick: true,
          draggable: false,
          hideProgressBar: true,
          pauseOnHover: true,
          position: 'top-center',
        });
        return;
      }

      if (state.widgets.length >= WIDGET_LIMIT_COUNT) {
        toast(
          `🦄 The dashboard only supports ${WIDGET_LIMIT_COUNT} active widgets.`,
          {
            autoClose: 5000,
            closeOnClick: true,
            draggable: false,
            hideProgressBar: true,
            pauseOnHover: true,
            position: 'top-center',
          }
        );
      } else {
        state.widgets.push({
          ...action.payload,
          enlargement: WidgetEnlargementStatus.NONE,
          targetPosition: state.widgets.length,
          uid: uuidv4(),
        } as WidgetState);
        let formattedWidgetType = uppercaseAllWords(action.payload.type);
        if (action.payload.type === 'transactions') {
          formattedWidgetType =
            uppercaseAllWords(action.payload.blockchain || '') +
            ' ' +
            uppercaseAllWords(action.payload.exchangeType || '') +
            ' ' +
            formattedWidgetType;
        }
        if (state.widgetsPerRow === 1 && state.widgets.length > 1) {
          toast(`${formattedWidgetType} widget opened`, {
            autoClose: 5000,
            closeOnClick: true,
            draggable: false,
            hideProgressBar: true,
            pauseOnHover: true,
            position: 'top-center',
          });
        }
        state.widgetChangeStatus = MobileMenuWidgetAction.ADDED;
      }
    },
    closeEnlarge: (state, action: PayloadAction<string>) => {
      state.widgets = state.widgets.map((widget) => {
        if (widget.uid === action.payload) {
          return {
            ...widget,
            enlargement: WidgetEnlargementStatus.NONE,
          };
        }
        return widget;
      });
    },
    initMobileMainMenuAction: (
      state,
      action: PayloadAction<MobileMenuWidgetAction>
    ) => {
      state.widgetChangeStatus = action.payload;
    },
    initWatchWidgetStatue: (state) => {
      state.watchWidgetStatus = MobileMenuWidgetAction.INIT;
    },
    mobileTokenDetails: (state, action: PayloadAction<boolean>) => {
      state.isMobileTokenDetailVisible = action.payload;
    },
    openNextWidget: (state, action: PayloadAction<string>) => {
      const sortedWidgets = [...state.widgets];
      sortedWidgets.sort((a, b) => a.targetPosition - b.targetPosition);

      const currentWidgetIndex = sortedWidgets.findIndex(
        (widget) => widget.uid === action.payload
      );

      if (currentWidgetIndex < 0) {
        return;
      }

      const nextWidgetIndex =
        currentWidgetIndex === sortedWidgets.length - 1
          ? 0
          : currentWidgetIndex + 1;

      sortedWidgets[nextWidgetIndex].enlargement =
        sortedWidgets[currentWidgetIndex].enlargement;
      sortedWidgets[currentWidgetIndex].enlargement =
        WidgetEnlargementStatus.NONE;
    },
    openPreviousWidget: (state, action: PayloadAction<string>) => {
      const sortedWidgets = [...state.widgets];
      sortedWidgets.sort((a, b) => a.targetPosition - b.targetPosition);

      const currentWidgetIndex = sortedWidgets.findIndex(
        (widget) => widget.uid === action.payload
      );

      if (currentWidgetIndex < 0) {
        return;
      }
      const previousWidgetIndex =
        (currentWidgetIndex + 1) % sortedWidgets.length;
      sortedWidgets[previousWidgetIndex].enlargement =
        sortedWidgets[currentWidgetIndex].enlargement;
      sortedWidgets[currentWidgetIndex].enlargement =
        WidgetEnlargementStatus.NONE;
    },
    removeFromWatchlist: (state, action: PayloadAction<WidgetState>) => {
      if (state.watchingWidgets) {
        const key = getKeyFromWidget(action.payload);
        delete state.watchingWidgets[key];
        state.watchWidgetStatus = MobileMenuWidgetAction.REMOVED;
      }
    },
    removePreferredToken: (state, action: PayloadAction<Pair>) => {
      state.preferredTokens = state.preferredTokens.filter(
        (pair) => !isPairEqual(pair, action.payload)
      );
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      const keyedLayout = keyBy(state.widgets, (widget) => widget.uid);
      const newWidgets = state.widgets
        .filter((widget) => widget.uid !== action.payload)
        .map((widget) =>
          widget.targetPosition < keyedLayout[action.payload].targetPosition
            ? widget
            : { ...widget, targetPosition: widget.targetPosition - 1 }
        );
      state.widgets = newWidgets;

      if (state.widgets.length === 0) {
        state.widgetChangeStatus = MobileMenuWidgetAction.INIT;
      } else {
        state.widgetChangeStatus = MobileMenuWidgetAction.REMOVED;
      }
    },
    setAboutUsModalVisibility: (state, action: PayloadAction<boolean>) => {
      state.aboutUsModalVisibility = action.payload;
    },
    setFaqModalVisibility: (state, action: PayloadAction<boolean>) => {
      state.faqModalVisibility = action.payload;
    },
    setMainMenu: (state, action: PayloadAction<boolean>) => {
      if (state.isMainMenuVisible !== action.payload) {
        state.isMainMenuVisible = action.payload;
      }
    },
    setSocialModal: (state, action: PayloadAction<SocialModal | undefined>) => {
      state.socialModal = action.payload;
    },
    startDrag: (state, action: PayloadAction<string>) => {
      state.draggingItemId = action.payload;
    },
    stopDrag: (state, action: PayloadAction<ControlPosition>) => {
      state.draggedItemId = state.draggingItemId;
      state.draggingItemId = '';
      state.cursorPositionAtDrop = action.payload;
    },
    swap: (state, action: PayloadAction<string>) => {
      if (state.draggedItemId) {
        const keyedWidgets = keyBy(state.widgets, (widget) => widget.uid);
        const draggedItem = keyedWidgets[state.draggedItemId];
        const droppedItem = keyedWidgets[action.payload];
        if (!!draggedItem && !!droppedItem) {
          state.widgets = state.widgets.map((widget) =>
            widget.uid === state.draggedItemId
              ? { ...draggedItem, targetPosition: droppedItem.targetPosition }
              : widget.uid === action.payload
              ? { ...droppedItem, targetPosition: draggedItem.targetPosition }
              : widget
          );
          state.draggingItemId = '';
          state.draggedItemId = '';
          state.cursorPositionAtDrop = null;
        }
      }
    },
    toggleEnlarge: (state, action: PayloadAction<EnlargementState>) => {
      const { isMobile, uid } = action.payload;

      state.widgets = state.widgets.map((widget) => {
        let windowStatus = WidgetEnlargementStatus.NONE;

        if (widget.enlargement === WidgetEnlargementStatus.NONE) {
          windowStatus = isMobile
            ? WidgetEnlargementStatus.FULLSCREEN
            : WidgetEnlargementStatus.ENLARGED;
        }

        if (widget.enlargement === WidgetEnlargementStatus.ENLARGED) {
          windowStatus = WidgetEnlargementStatus.FULLSCREEN;
        }

        if (widget.enlargement === WidgetEnlargementStatus.FULLSCREEN) {
          windowStatus = isMobile
            ? WidgetEnlargementStatus.NONE
            : WidgetEnlargementStatus.ENLARGED;
        }

        if (widget.uid === uid) {
          return {
            ...widget,
            enlargement: windowStatus,
          };
        }

        return widget;
      });
    },
    toggleExtraWidgets: (state, action: PayloadAction<boolean>) => {
      if (state.isExtraWidgetsVisible !== action.payload) {
        state.isExtraWidgetsVisible = action.payload;
      }
    },
    toggleTableView: (
      state,
      action: PayloadAction<{ uid: string; isTable?: boolean }>
    ) => {
      state.widgets = state.widgets.map((widget) =>
        widget.uid === action.payload.uid
          ? widget
          : { ...widget, isTable: action.payload.isTable }
      );
    },
    toggleTokenDetails: (state, action: PayloadAction<string>) => {
      state.widgets = state.widgets.map((widget) =>
        widget.uid === action.payload
          ? {
              ...widget,
              isTokenDetailsOpened: !widget.isTokenDetailsOpened,
            }
          : widget
      );
      state.isMobileTokenDetailVisible = true;
    },
    toggleWalletModal: (state, action: PayloadAction<boolean>) => {
      state.walletModalVisibility = action.payload;
    },
    updateColumnLayout: (
      state,
      action: PayloadAction<State['widgetGridLayout']>
    ) => {
      state.widgetGridLayout = action.payload;
    },
    updateMobileNetwork: (state, action: PayloadAction<NetworkName>) => {
      state.mobileNetwork = action.payload;
    },
    updateToolbar: (
      state,
      action: PayloadAction<{
        uid: string;
        toolbar: WidgetToolbar;
      }>
    ) => {
      state.widgets = state.widgets.map((widget) =>
        widget.uid === action.payload.uid
          ? {
              ...widget,
              toolbar:
                action.payload.toolbar === widget.toolbar
                  ? undefined
                  : action.payload.toolbar,
            }
          : widget
      );
    },

    updateWidget: (
      state,
      action: PayloadAction<{ uid: string } & Partial<WidgetState>>
    ) => {
      state.widgets = state.widgets.map((widget) =>
        widget.uid !== action.payload.uid
          ? widget
          : {
              ...widget,
              ...action.payload,
            }
      );
    },
    updateWidgetWidth: (state, action: PayloadAction<number | undefined>) => {
      state.widgetWidth = action.payload;
    },

    updateWidgetsPerRow: (state, action: PayloadAction<number>) => {
      state.widgetsPerRow = action.payload;
    },
  },
});

export const {
  addChartWidget,
  addPreferredToken,
  addToWatchlist,
  addWidget,
  closeEnlarge,
  initMobileMainMenuAction,
  initWatchWidgetStatue,
  mobileTokenDetails,
  openNextWidget,
  openPreviousWidget,
  removeFromWatchlist,
  removePreferredToken,
  removeWidget,
  setAboutUsModalVisibility,
  setFaqModalVisibility,
  setMainMenu,
  setSocialModal,
  startDrag,
  stopDrag,
  swap,
  toggleEnlarge,
  toggleExtraWidgets,
  toggleTableView,
  toggleTokenDetails,
  toggleWalletModal,
  updateColumnLayout,
  updateMobileNetwork,
  updateToolbar,
  updateWidget,
  updateWidgetWidth,
  updateWidgetsPerRow,
} = slice.actions;

export default slice;
