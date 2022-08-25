// Module containing functionality for getting mock Data Transfer Objects (DTO's)

import { Channel, PlaylistItem } from "../lib/types/dtos";
import { mockManyChannelsResponse, mockPlaylistItemListResponses, mockSubscriptionsResponses } from "./responses";

/**
 * Returns a list of structs that containing the pageToken used to retrieve the subscription item, 
 * as well as the channel data itself
 */
export function getMockPageTokenChannelStructs(): { channel: Channel, pageToken: string }[] {
    const results: { channel: Channel, pageToken: string }[] = [];
    let timestampOffset = 0;
    for (const pageToken in mockSubscriptionsResponses) {
        if (Object.prototype.hasOwnProperty.call(mockSubscriptionsResponses, pageToken)) {
            const subscriptionResponse = mockSubscriptionsResponses[pageToken];
            for (let index = 0; index < subscriptionResponse.items.length; index++) {
                const item = subscriptionResponse.items[index];
                const channel = new Channel(subscriptionResponse, mockManyChannelsResponse[item.snippet.resourceId.channelId], index);
                // To mock a time difference between each channel: Useful in determining the latest channel in home page.
                channel.timestamp.setSeconds(channel.timestamp.getSeconds() + index + (timestampOffset * 10));
                results.push({ pageToken, channel });
            }
        }
        timestampOffset++;
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
        let timestampOffset = 0;

        for (const pageToken in rawPlaylistItemsResponses) {
            if (Object.prototype.hasOwnProperty.call(rawPlaylistItemsResponses, pageToken)) {
                const response = rawPlaylistItemsResponses[pageToken];
                const items = response.items.map((item, index) => {
                    const playlistItem = new PlaylistItem(response, item, channel.id);
                    // To mock a time difference between each playlist item: Useful in determining the latest playlist item in home page.
                    playlistItem.timestamp.setSeconds(playlistItem.timestamp.getSeconds() + index + (timestampOffset * 10));
                    return playlistItem;
                });
                result.push({ channel, playlist: { pageToken, items } });
            }

            timestampOffset++;
        }

    }

    return result;
}


