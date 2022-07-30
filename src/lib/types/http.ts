/**
 * HTTP Requests and Responses
 */
export type LoginDetailsResponse = {
    "device_code": string;
    "user_code": string;
    "verification_url": string;
    "expires_in": number;
    "interval": number;
};

export type LoginStatusRequest = {
    "device_code": string;
    "interval": number;
};

export type LoginStatusResponse = {
    "access_token": string;
    "token_type": string;
    "expires_in": number;
    "refresh_token": string;
};

export type RefreshTokenRequest = {
    refresh_token: string;
};

export type RefreshTokenResponse = {
    "access_token": string;
    "expires_in": number;
    "scope": string;
    "token_type": string;
};


export type SubscriptionResponse = {
    "nextPageToken"?: string,
    "prevPageToken"?: string,
    "pageInfo": {
        "totalResults": number,
        "resultsPerPage": number
    },
    items: SubscriptionDetails[],
}


export type SubscriptionDetails = {
    "id": string,
    "snippet": {
        "title": string,
        "description": string,
        "resourceId": {
            "channelId": string
        },
        "thumbnails": {
            "default": {
                "url": string
            },
            "medium": {
                "url": string
            },
            "high": {
                "url": string
            }
        }
    }
}

export type HttpRequestHeaders = {
    "X-YouHedge-Token": string,
    Accept: "application/json",
}

export type ChannelDetails = {
    "id": string,
    "snippet": {
        "title": string,
        "description": string,
        "thumbnails": {
            "default": {
                "url": string,
                "width": 88,
                "height": 88
            },
            "medium": {
                "url": string,
                "width": 240,
                "height": 240
            },
            "high": {
                "url": string,
                "width": 800,
                "height": 800
            }
        }
    },
    "contentDetails": {
        "relatedPlaylists": {
            "uploads": string
        }
    }
}

export type PlaylistItemListResponse = {
    "nextPageToken"?: string,
    "prevPageToken"?: string,
    "pageInfo": {
        "totalResults": number,
        "resultsPerPage": number
    },
    "items": PlaylistItemResponse[]
}

export type PlaylistItemResponse = {
    "id": string,
    "snippet": {
        "title": string,
        "description": string,
        "thumbnails": {
            "default": {
                "url": string,
                "width": 120,
                "height": 90
            },
            "medium": {
                "url": string,
                "width": 320,
                "height": 180
            },
            "high": {
                "url": string,
                "width": 480,
                "height": 360
            }
        },
        "position": number,
        "resourceId": {
            "videoId": string
        }
    }
}
