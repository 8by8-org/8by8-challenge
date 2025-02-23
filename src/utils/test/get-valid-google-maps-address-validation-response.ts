import type { Address } from '@/model/types/addresses/address';
import type { ProcessableResponse } from '@/services/server/validate-addresses/validate-addresses-with-google-maps/types/processable-response';

/**
 * @remarks
 * Generates a mocked response simulating a valid address validation result from the Google Maps API.
 *
 * @param address
 *
 * @returns A `ProcessableResponse` object that mimics the structure of a response from the Google Maps API.
 *
 * @example
 * See validate-addresses-with-google-maps.test.ts for a helpful example!
 */
export function getValidGoogleMapsAddressValidationResponse(address: Address) {
  const processableResponseBody: ProcessableResponse = {
    result: {
      verdict: {
        hasUnconfirmedComponents: false,
      },
      address: {
        postalAddress: {
          postalCode: address.zip,
          administrativeArea: address.state,
          locality: address.city,
          addressLines: [address.streetLine1],
        },
        addressComponents: [
          {
            componentName: {
              text: address.streetLine1.slice(
                0,
                address.streetLine1.indexOf(' '),
              ),
            },
            componentType: 'street_number',
            confirmationLevel: 'CONFIRMED',
          },
          {
            componentName: {
              text: address.streetLine1.slice(
                address.streetLine1.indexOf(' ') + 1,
              ),
            },
            componentType: 'route',
            confirmationLevel: 'CONFIRMED',
          },
          {
            componentName: {
              text: address.city,
            },
            componentType: 'locality',
            confirmationLevel: 'CONFIRMED',
          },
          {
            componentName: {
              text: address.state,
            },
            componentType: 'administrative_area_level_1',
            confirmationLevel: 'CONFIRMED',
          },
          {
            componentName: {
              text: address.zip,
            },
            componentType: 'postal_code',
            confirmationLevel: 'CONFIRMED',
          },
        ],
      },
    },
  };

  if (address.streetLine2) {
    processableResponseBody.result.address.postalAddress.addressLines.push(
      address.streetLine2,
    );
    processableResponseBody.result.address.addressComponents.push({
      componentName: {
        text: address.streetLine2,
      },
      componentType: 'subpremise',
      confirmationLevel: 'CONFIRMED',
    });
  }

  return processableResponseBody as ProcessableResponse;
}
