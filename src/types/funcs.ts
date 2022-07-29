import { Channel } from "./dtos";

/**
 * Functions
 */
export type VoidFunc = () => void;
export type ChannelBatchRefreshFunc = (pageToken?: string) => void;
export type PlaylistItemBatchRefreshFunc = (channel: Channel, pageToken?: string) => void;