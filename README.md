# YouHedge

A WebOS application to sidestep the mentally-degrading YouTube news feed and only view channels subscribed to.

## Dependencies

- [webOS v4.0+](https://www.lg.com/global/business/webos)
- [nodejs v16+](https://nodejs.org/en/)
- [reactjs v18+](https://reactjs.org/)
- [react router v6+](https://reactrouter.com/)

## Quick Start

- Ensure you have the [webOS CLI](https://webostv.developer.lge.com/sdk/command-line-interface/installation/) and [webOS simulator](https://webostv.developer.lge.com/sdk/Simulator/installation/) installed.
- Clone the repo

```shell
git clone git@github.com:sopherapps/you-hedge.git
```

- Install dependencies

```shell
cd you-hedge
yarn install
```

- Build the app

```shell
yarn build
```

- Open the webOS simulator
- In the simulator, Select 'launch app' and select the .ipk file on the root of this project folder

## Design

### Constraints:

- Youtube data api has daily quotas of upto 10,000 currently
- LG WebOS apps use JS/HTML/CSS with DB8 for data storage, and localStorage, sessionStorage.
- LocalStorage does not get cleared when app is uninstalled, but sessionStorage should as it is attached to the session.

### Requirements:

- User can view all channels subscribed to. (Subscription is done only in YouTube)
- User can select any channel and view a list of uploads for each channel
- User can select any uploaded video and watch it in full screen
- User can press back button to go back to previous screen
- User can log in with their google account

### Design Decisions:

- Use react and react-router to create a single page application
- Use gapi to login with google, and make requests to the YouTube data api v3
- Save auth token in session storage
- cache YouTube data api requests in session storage for a TTL of upto 5 minutes
- Use the YouTube iframe to play the youtube videos themselves

### Project Structure

The project in divided along the main lines of display (`pages`), data persistence (`store`) and 
backend integration (`client`).

- `pages` folder contains all the pages/screens to be displayed by the app
- `dtos` folder contains the Data Transfer Objects used in the application
- `store` folder contains the interface to the store that stores the app's data
- `client` folder contains the functionality to interface with the Youtube data client 
- `lib` folder contains `components`, common `utils` and common `assets`.

## How to Test

- Clone the repo

```shell
git clone git@github.com:sopherapps/you-hedge.git
```

- Install dependencies

```shell
cd you-hedge
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
