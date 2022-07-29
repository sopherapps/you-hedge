import React from "react";
import { LoginDetails, Channel, PlaylistItem } from "./types/dtos";

export const IsLoggedInContext = React.createContext<boolean>(false);
export const LoginDetailsContext = React.createContext<LoginDetails>(new LoginDetails({
    user_code: "",
    verification_url: "",
    device_code: "",
    interval: 0,
    expires_in: 0
}));
export const ChannelsContext = React.createContext<{ [key: string]: Channel }>({});
export const PlaylistItemsContext = React.createContext<{ [key: string]: PlaylistItem }>({});