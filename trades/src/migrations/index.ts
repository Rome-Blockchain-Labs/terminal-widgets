import ReplaceNetworkExchangeEnumsForStrings from './replaceNetworkExchangeEnumsForStrings';
import UpdateDmmToKyberDmm from './UpdateDmmToKyberDmm';
import UpdateWidgetTypeEnumToString from './UpdateWidgetTypeEnumToString';

const MIGRATION_ITERATOR_KEY = 'rometerminal_migration_iterator';

/**
 * There was a bug in the code where the first migration wasn't run.
 * This caused issues. The hot fix for this was to duplicate the migration that wasn't run
 * to avoid needing to reset user's migration index. The migrations after the missing one
 * has to be re-run again as well, hence the duplicates at the start of the list.
 * Hotfix done Apr 27, 2022
 * **/
const migrations: Array<(storage: any) => any> = [
  UpdateWidgetTypeEnumToString,
  ReplaceNetworkExchangeEnumsForStrings,
  UpdateDmmToKyberDmm,
  UpdateWidgetTypeEnumToString,
  ReplaceNetworkExchangeEnumsForStrings, //deprecated the old migration (UpdateExchangeTypeEnumToString) as it was broken due to a mapping assumption
  UpdateDmmToKyberDmm,
  ReplaceNetworkExchangeEnumsForStrings,
  ReplaceNetworkExchangeEnumsForStrings,
  ReplaceNetworkExchangeEnumsForStrings, //somehow the last migration slot was run on sandbox for some users, duplicating it for safety
];

// TODO - refactor to use version number instead of migration index
export const migrateLocalStorage = (reduxStorage: any) => {
  const lastMigrationIndexStr = window.localStorage.getItem(
    MIGRATION_ITERATOR_KEY
  );

  let appStorage = reduxStorage.app;
  let hasError = true;

  // appStorage = UpdateExchangeTypeEnumToString(appStorage);

  if (reduxStorage.app && lastMigrationIndexStr) {
    try {
      const lastMigrationIndex = parseInt(lastMigrationIndexStr);

      for (let i = lastMigrationIndex + 1; i < migrations.length; i++) {
        appStorage = migrations[i](appStorage);
      }

      hasError = false;
    } catch (error) {
      console.error(error);
    }
  }

  window.localStorage.setItem(
    MIGRATION_ITERATOR_KEY,
    (migrations.length - 1).toString()
  );

  /**
   * {} will reset redux store with default states
   * Reset conditions
   * 1. When error happens while running migrations
   * 2. If there's no previous redux data saved on localstorage
   * 3. We are using `rometerminal_migration_iterator` to identify what migrations are run. If this key is not set, we need to enforce user to clear localstorage once.
   */
  return hasError ? {} : { ...reduxStorage, app: appStorage };
};
