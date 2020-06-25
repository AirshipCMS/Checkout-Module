# CheckoutModule

Authenticated Checkout for Single Payment Orders and Subscriptions. If want to support Guest Checkout, please see the [guest-checkout branch](https://github.com/AirshipCMS/Checkout-Module/tree/guest-checkout).

## Setup

fork this repo.

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

## Shipping Types

Checkout Shipping Types need to match the Shipping Types that have been saved for your Airship Site. If the spelling & capitalization of shipping types in this list does not match the database exactly, shipping will default to 0 for every order.

Shipping Types only apply to Single-Payment Orders. A subscription plan has a set price that cannot be modified by a Tax, Shipping, or Handling values. If you want to set different subscription pricing based on a customer's Shipping Address, you need to create different Subscription Products and Custom Add-to-Cart functionality based on shipping address.

Before building, add your Shipping Types to the `shipping_types` array in `src/environments/environment.prod.ts` (`src/environments/environment.alpha.ts` for alpha).

```
export const environment = {
  production: true,
  stripe_publish_key: 'xxxxxxx',
  shipping_types: ['USPS', 'FedEx',  'UPS']
};
```

## Environment Variables

production: `src/environments/environment.prod.ts`
alpha: `src/environments/environment.alpha.ts`

`stripe_publish_key` is required for Stripe.

`shipping_types`
