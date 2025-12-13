import type { Address } from '@/model/types/addresses/address';

export function getAddressLines(address: Address): string[] {
  let addressLines = [address.streetLine1];

  /* istanbul ignore else */
  if (address.streetLine2) {
    addressLines.push(address.streetLine2);
  }

  addressLines = addressLines.concat([
    address.city,
    address.state,
    address.zip,
  ]);

  return addressLines;
}
