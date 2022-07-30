import { AuthDetails, LoginDetails } from "./dtos";

export interface LoginStatus {
    /**
     * the details associated with the status
     */
    details: LoginDetails | AuthDetails | undefined;

    /**
     * Initializes the login for the current user
     * 
     * @param details - the login details to be used by user to sign in i.e user code and verification url
     */
    initialize(details: LoginDetails): LoginStatus;

    /**
     * Finalizes the login of the current user after checking whether the user 
     * has successfully signed in using the login details
     * 
     * @param details - the authentication details got from finalizing login for the user
     */
    finalize(details: AuthDetails): LoginStatus;
}

export class LoginFinalized implements LoginStatus {
    details: LoginDetails | AuthDetails | undefined;

    /**
     * Represents the state of the app when its authentication is finalized
     * @param details - the authentication details got from the API
     */
    constructor(details: AuthDetails) {
        this.details = details;
    }

    initialize(details: LoginDetails): LoginStatus {
        // if the login state is final, it can't be initialized again (unless we add logout)
        return this;
    }

    finalize(details: AuthDetails): LoginStatus {
        // already finalized, mehn.
        return this;
    }
}

export class LoginInitialized implements LoginStatus {
    details: LoginDetails | AuthDetails | undefined;

    /**
     * Represents the state of the app when login has been initialized, pending user signin
     * from a separate device (TV signin requires a user to sign in via their phone or something)
     * 
     * @param details - the login details that are to be used by user to login
     */
    constructor(details: LoginDetails) {
        this.details = details;
    }

    initialize(details: LoginDetails): LoginStatus {
        // already initialized, ma'am. No worries.
        return this;
    }

    finalize(details: AuthDetails): LoginStatus {
        return new LoginFinalized(details);
    }

}

export class LoginPending implements LoginStatus {
    details: LoginDetails | AuthDetails | undefined;

    initialize(details: LoginDetails): LoginStatus {
        return new LoginInitialized(details);
    }

    finalize(details: AuthDetails): LoginStatus {
        // hey, mehn, no skipping like that. First initialize, bro!
        return this;
    }
}
