# CheckoutModule

## Setup

clone this repo.

To install dependencies, run `npm install`

run `cp src/environments/environment.prod.ts src/environments/environment.alpha.ts`
in `src/environments/environment.alpha.ts` set `production` to `false`.
Enter a stripe key.

## Dev Server

### Alpha
in the file `proxy.conf.alpha.json`, change `target` to your airshipcms site.
Run `npm run alpha`.

### Prod
in the file `proxy.conf.prod.json`, change `target` to your airshipcms site.
Run `npm run prod`.

Navigate to `http://localhost:4200/checkout`. The app will automatically reload if you change any of the source files.

## Build

### Alpha
Run `npm run build-alpha`

### Prod
Run `npm run build`

All files will build into `/dist`.

In your airship project:
drop `airship-checkout.min.js` into `compartmnets/assets/scripts`.
drop `airship-checkout.min.css` into `compartmnets/assets/styles`.
include these files in `templates/checkout.html`

## Shipping Type

If your build requires shipping, be sure the options in the Shipping Type dropdown matches the avaliable options in the `shipping_type` column of the `shipping_tables` table exactly.

## Environment Variables

production: `src/environments/environment.prod.ts`
alpha: `src/environments/environment.alpha.ts`

`stripe_publish_key` is required for Stripe.

`skip_single_payment_shipping` boolean. To skip shipping address and shipping type for Single Payment Orders, set this to true.

`skip_subscription_shipping` boolean. To skip shipping address and shipping type for Subscription Orders, set this to true.

`has_no_shipments` boolean. To conditionally skip shipping address and shipping type for certain Subscription Orders, set this to true. In your Subscription Collection, create a `checkbox` field named `Has No Shipments`. Check the box for items with no shipments.

If `skip_single_payment_shipping`, `skip_subscription_shipping` or `has_no_shipments` is set to `true`, go to `src/environments/default-vendor-address.ts`. Enter a default address. If no default address is entered, checkout will fail.