import React from "react";
import { Channel, PlaylistItem } from "./types/dtos";
import { LoginStatus, LoginPending } from "./types/state";

export const LoginStatusContext = React.createContext<LoginStatus>(new LoginPending());
export const ChannelsContext = React.createContext<{ [key: string]: Channel }>({});
export const PlaylistItemsContext = React.createContext<{ [key: string]: PlaylistItem }>({});