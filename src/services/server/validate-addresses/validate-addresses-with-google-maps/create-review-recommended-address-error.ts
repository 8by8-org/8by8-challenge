import { AddressErrorTypes } from '@/model/types/addresses/address-error-types';
import type { ReviewRecommendedAddressError } from '@/model/types/addresses/review-recommended-address-error';
import type { Address } from '@/model/types/addresses/address';
import type { AddressFormNames } from '@/model/types/addresses/address-form-names';
import type { AddressComponents } from '@/model/types/addresses/address-components';

export function createReviewRecommendedAddressError(
  address: Address,
  result: any,
  form: AddressFormNames,
): ReviewRecommendedAddressError {
  const recommendedAddress = getRecommendedAddressFromResult(result);

  return {
    type: AddressErrorTypes.ReviewRecommendedAddress,
    form,
    enteredAddress: compareAddressesAndCreateAddressComponents(
      address,
      recommendedAddress,
    ),
    recommendedAddress: compareAddressesAndCreateAddressComponents(
      recommendedAddress,
      address,
    ),
  };
}

function getRecommendedAddressFromResult(result: any): Address {
  const { address } = result;

  const recommendedAddress: Address = {
    streetLine1: address.postalAddress.addressLines[0],
    city: address.postalAddress.locality,
    state: address.postalAddress.administrativeArea,
    zip: address.addressComponents.find(
      (component: any) => component.componentType === 'postal_code',
    ).componentName.text,
  };

  const streetLine2 = address.postalAddress.addressLines[1];

  if (streetLine2) {
    recommendedAddress.streetLine2 = streetLine2;
  }

  return recommendedAddress;
}

function compareAddressesAndCreateAddressComponents(
  addressA: Address,
  addressB: Address,
): AddressComponents {
  const addressComponents: AddressComponents = {
    streetLine1: {
      value: addressA.streetLine1,
      hasIssue: addressA.streetLine1 !== addressB.streetLine1,
    },
    city: {
      value: addressA.city,
      hasIssue: addressA.city !== addressB.city,
    },
    state: {
      value: addressA.state,
      hasIssue: addressA.state !== addressB.state,
    },
    zip: {
      value: addressA.zip,
      hasIssue: addressA.zip !== addressB.zip,
    },
  };

  if (addressA.streetLine2) {
    addressComponents.streetLine2 = {
      value: addressA.streetLine2,
      hasIssue: addressA.streetLine2 !== addressB.streetLine2,
    };
  }

  return addressComponents;
}
