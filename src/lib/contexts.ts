import React from "react";
import { Channel, PlaylistItem } from "./types/dtos";
import { LoginStatus } from "./types/state";

export const LoginStatusContext = React.createContext<LoginStatus | null>(null);
export const ChannelsContext = React.createContext<{ [key: string]: Channel }>({});
export const PlaylistItemsContext = React.createContext<{ [key: string]: PlaylistItem }>({});