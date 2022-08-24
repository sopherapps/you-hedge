// Module containing functionality for getting mock Data Transfer Objects (DTO's)

import { Channel, PlaylistItem } from "../lib/types/dtos";
import { mockManyChannelsResponse, mockPlaylistItemListResponses, mockSubscriptionsResponses } from "./responses";

/**
 * Returns a list of structs that containing the pageToken used to retrieve the subscription item, 
 * as well as the channel data itself
 */
export function getMockPageTokenChannelStructs(): { channel: Channel, pageToken: string }[] {
    const results: { channel: Channel, pageToken: string }[] = [];
    for (const pageToken in mockSubscriptionsResponses) {
        if (Object.prototype.hasOwnProperty.call(mockSubscriptionsResponses, pageToken)) {
            const subscriptionResponse = mockSubscriptionsResponses[pageToken];
            for (let index = 0; index < subscriptionResponse.items.length; index++) {
                const item = subscriptionResponse.items[index];
                const channel = new Channel(subscriptionResponse, mockManyChannelsResponse[item.snippet.resourceId.channelId], index);
                results.push({ pageToken, channel });
            }
        }
    }

    return results;
}

/**
 * returns an array of playlists and their associated channels and pageToken used to retrieve them from YouTube
 */
export function getMockPlaylistItemsStructs(): { channel: Channel, playlist: { pageToken: string, items: PlaylistItem[] } }[] {
    const result: { channel: Channel, playlist: { pageToken: string, items: PlaylistItem[] } }[] = [];
    const mockPageTokenChannelStructs = getMockPageTokenChannelStructs();

    for (const { channel } of mockPageTokenChannelStructs) {
        const rawPlaylistItemsResponses = mockPlaylistItemListResponses[channel.playlistId];

        for (const pageToken in rawPlaylistItemsResponses) {
            if (Object.prototype.hasOwnProperty.call(rawPlaylistItemsResponses, pageToken)) {
                const response = rawPlaylistItemsResponses[pageToken];
                const items = response.items.map((item) => new PlaylistItem(response, item, channel.id));
                result.push({ channel, playlist: { pageToken, items } });
            }
        }
    }

    return result;
}


