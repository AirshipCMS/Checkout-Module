import { defaultVendorAddress } from './default-vendor-address';

export const environment = {
  production: true,
  stripe_publish_key: 'xxxxxxx',
  skip_single_payment_shipping: false,
  has_no_shipments: false,
  default_address: defaultVendorAddress,
  shipping_types: ['USPS', 'FedEx',  'UPS']
};
