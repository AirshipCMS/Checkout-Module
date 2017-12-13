# CheckoutModule

## Setup

clone this repo.

To install dependencies, run `npm install`

run `cp src/environments/environment.prod.ts src/environments/environment.alpha.ts`
in `src/environments/environment.alpha.ts` set `production` to `false`.
Enter your domain and stripe key.

## Dev Server

### Alpha
Run `ng serve --env=alpha`.

### Prod
Run `ng serve --env=prod`.

Navigate to `http://localhost:4200/checkout`. The app will automatically reload if you change any of the source files.

## Build

### Alpha
Run `ng build --prod --env=alpha`

### Prod
Run `ng build --prod --env=prod`

All files will build into `/dist`

## Shipping Type

If your build requires shipping, be sure the options in the Shipping Type dropdown matches the avaliable options in the `shipping_type` column of the `shipping_tables` table exactly.

## Environment Variables

production: `src/environments/environment.prod.ts`
alpha: `src/environments/environment.alpha.ts`

`domain` is required and should be your airship site domain: `domain.airshipcms.io`.

`stripe_publish_key` is required for Stripe.

`skip_single_payment_shipping` must be a boolean. To skip shipping address and shipping type for Single Payment Orders, set this to true.

`skip_subscription_shipping` must be a boolean. To skip shipping address and shipping type for Subscription Orders, set this to true.

`has_no_shipments` must be a boolean. To conditionally skip shipping address and shipping type for certain Subscription Orders, set this to true. In your Subscription Collection, create a `checkbox` field named `Has No Shipments`. Check the box for items with no shipments.

If `skip_single_payment_shipping`, `skip_subscription_shipping` or `has_no_shipments` is set to `true`, go to `src/environments/default-vendor-address.ts`. Enter a default address. If no default address is entered, checkout will fail.