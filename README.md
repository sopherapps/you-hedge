# YouHedge

> ' Come unto Me, all ye that labour and are heavy laden, and I will give you rest. Take My yoke upon you, and learn of Me; for I am meek and lowly in heart: and ye shall find rest unto your souls. For My yoke is easy, and My burden is light.'
>
> -- [Matthew 11:28-30](https://www2.bible.com/bible/1/MAT.11.28-30)

![CI status](https://github.com/sopherapps/you-hedge/actions/workflows/firebase-hosting-merge.yml/badge.svg)


A Web application to sidestep the mentally-degrading YouTube news feed and only view channels subscribed to.
Its back end can be found at [https://github.com/sopherapps/you-hedge-back](https://github.com/sopherapps/you-hedge-back).

**The webOS version of the app is found in the [./webos](./webos/) folder.**


## Dependencies

- [nodejs v16+](https://nodejs.org/en/)
- [reactjs v18+](https://reactjs.org/)
- [react router v6+](https://reactrouter.com/)
- [webOS v4.0+](https://www.lg.com/global/business/webos) for webOS app

## What it Looks like

### 1. Login Page (Welcome page)

![YouHedge Login page](./designs/youhedge%20login.png)

### 2. Home page

![YouHedge Home page](./designs/youhedge%20home.png)

### 3. YouTube Player Page

![YouHedge YouTube Player Page](./designs/youhedge%20youtube%20player.png)

### 4. YouTube Player Page on Hover at the top (Showing back button)

![YouTube Player Page on Hover at the top (Showing back button)](./designs/youhedge%20youtube%20player%20with%20back%20button.png)

## Quick Start (web)

- Set up the [backend](https://github.com/sopherapps/you-hedge-back)

- Clone the repo

```shell
git clone git@github.com:sopherapps/you-hedge.git
```

- Copy the `.example.env` file to `.env` file and update its variables

```shell
cd you-hedge
cp .example.env .env
```

- Install dependencies

```shell
yarn install
```

- Start the app

```shell
yarn start
```

- Open the browser at [localhost:3000](http://localhost:3000) if it is not yet open already

## Quick Start (webOS)

- Set up the [backend](https://github.com/sopherapps/you-hedge-back)

- Ensure you have the [webOS CLI](https://webostv.developer.lge.com/sdk/command-line-interface/installation/) and [webOS simulator](https://webostv.developer.lge.com/sdk/Simulator/installation/) installed.
- Clone the repo

```shell
git clone git@github.com:sopherapps/you-hedge.git
```

- Set up the web app as shown in [the instructions above](#quick-start-web)

- Host it on a server of your choice and get its URL.

- Update the `location.href = 'https://youhedge.web.app';` line in the [webos/index.html](./webos/index.html) file, replacing `https://youhedge.web.app` with your URL got above.

- Open the webOS simulator
- In the simulator, Select 'launch app' from 'tools' and select the `webos` folder in the root of the `you-hedge` folder.

## Design

### Constraints:

- Youtube data api has daily quotas of upto 10,000 currently
- LG WebOS apps use JS/HTML/CSS with DB8 for data storage, and localStorage, sessionStorage.
- LocalStorage may not get cleared when app is uninstalled, but sessionStorage should as it is attached to the session.

### Requirements:

- User can view all channels subscribed to. (Subscription is done only in YouTube)
- User can select any channel and view a list of uploads for each channel
- User can select any uploaded video and watch it in full screen
- User can press back button to go back to previous screen
- User can log in with their google account

### Design Decisions:

- Use react and react-router to create a single page application
- Move all requests sent to YuoTube to [a separate backend](https://github.com/sopherapps/you-hedge-back) to avoid the exposure of Google API client secrets and API keys.
- Save all data in [LocalForage](https://github.com/localForage/localForage) for the sake of the progressive web app (PWA) since 
service workers can't access sessionStorage or localStorage.
- Use the YouTube iframe to play the youtube videos themselves

### Project Structure

The project (`src`) is divided along the main lines of display (`pages` and `components`), business logic (`lib`).

- `pages` folder contains all the pages/screens to be displayed by the app
- `components` folder contains all reusable reactjs components for the app
- `lib` folder contains the business logic that is separate from display
  - `store.ts` file contains the interface to the store that stores the app's data
  - `client` folder contains the interface to the back end API
  - `types` folder contains a number of types that are used in the app
    - `dtos.ts` contains the types that are actually relevant within the app as data transfer objects
    - `http.ts` contains a number of types representing HTTP requests and responses as expected from the back end.
    - `state.ts` contains the separate states the entire app could be in. This is separate from the data it will have. For example the app behaves differently when authenticated as opposed to when it is not authenticated.

## How to Test

- Clone the repo

```shell
git clone git@github.com:sopherapps/you-hedge.git
```

- Copy the `.example.env` file to `.env` file and update its variables

```shell
cd you-hedge
cp .example.env .env
```

- Install dependencies

```shell
yarn install
```

- Run the test command

```shell
yarn test
```

## Acknowledgments

- We can do nothing without God (John 15: 5). Glory be to Him.

## License

Copyright (c) 2022 [Martin Ahindura](https://github.com/tinitto). Licensed under the [MIT License](./LICENSE)

## Gratitude

All glory be to God

<a href="https://www.buymeacoffee.com/martinahinJ" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
