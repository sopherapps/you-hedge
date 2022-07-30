import React from "react";
import { Channel, PlaylistItem } from "./lib/types/dtos";
import { LoginStatus, LoginPending } from "./lib/types/state";

export const LoginStatusContext = React.createContext<LoginStatus>(new LoginPending());
export const ChannelsContext = React.createContext<{ [key: string]: Channel }>({});
export const PlaylistItemsContext = React.createContext<{ [key: string]: PlaylistItem }>({});