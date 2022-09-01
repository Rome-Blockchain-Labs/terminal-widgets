import { Currency, ETHER, Token } from '@rbl/velox-common/uniV2ClonesSDK';

export function currencyId(
  currency: Currency & { isNative?: boolean }
): string {
  if (currency === ETHER || currency.isNative) return currency.symbol || 'AVAX'; //todo defaulting to avax is hacky but I don't think the symbol will ever be empty
  if (currency instanceof Token) return currency.address;
  throw new Error('invalid currency');
}
