import { ChannelDetails, LoginDetailsResponse, LoginStatusResponse, PlaylistItemListResponse, RefreshTokenResponse, SubscriptionResponse } from "../lib/types/http";

export const mockLoginDetailsResponse: LoginDetailsResponse = {
    device_code: "someDecideCode",
    user_code: "SOME-USER-CODE",
    verification_url: "http://example.com",
    expires_in: 120, // two minutes
    interval: 3
};
export const mockLoginStatusResponse: LoginStatusResponse = {
    access_token: "someAccessToken",
    token_type: "Bearer",
    expires_in: 120,
    refresh_token: "someRefreshToken"
};
export const mockRefreshTokenResponse: RefreshTokenResponse = {
    access_token: "anotherAccessToken",
    expires_in: 120,
    scope: "youtube",
    token_type: "Bearer"
};
export const mockSubscriptionsResponses: { [key: string]: SubscriptionResponse } = {
    prev: {
        "nextPageToken": "yutth",
        "pageInfo": {
            "totalResults": 39,
            "resultsPerPage": 2
        },
        "items": [
            {
                "id": "iuyuvghkg",
                "snippet": {
                    "title": "Yoooo",
                    "description": "Some stuff",
                    "resourceId": {
                        "channelId": "iuiuoaiuh"
                    },
                    "thumbnails": {
                        "default": {
                            "url": "https://yt3.ggpht.com/ytc/kk"
                        },
                        "medium": {
                            "url": "https://yt3.ggpht.com/ytc/uueh"
                        },
                        "high": {
                            "url": "https://yt3.ggpht.com/ytc/yteh"
                        }
                    }
                }
            },
            {
                "id": "aiow78237832bkja",
                "snippet": {
                    "title": "Penicilin",
                    "description": "",
                    "resourceId": {
                        "channelId": "Gundi"
                    },
                    "thumbnails": {
                        "default": {
                            "url": "https://yt3.ggpht.com/ytc/ye7"
                        },
                        "medium": {
                            "url": "https://yt3.ggpht.com/ytc/yutew"
                        },
                        "high": {
                            "url": "https://yt3.ggpht.com/ytc/uyyere"
                        }
                    }
                }
            }
        ]
    },
    yutth: {
        "prevPageToken": "prev",
        "pageInfo": {
            "totalResults": 39,
            "resultsPerPage": 2
        },
        "items": [
            {
                "id": "anotherId",
                "snippet": {
                    "title": "Another Channel",
                    "description": "Another",
                    "resourceId": {
                        "channelId": "anotherChannelId2"
                    },
                    "thumbnails": {
                        "default": {
                            "url": "https://yt3.ggpht.com/ytc/ader"
                        },
                        "medium": {
                            "url": "https://yt3.ggpht.com/ytc/ewre"
                        },
                        "high": {
                            "url": "https://yt3.ggpht.com/ytc/sdsf"
                        }
                    }
                }
            }
        ]
    },
};

export const mockManyChannelsResponse: { [key: string]: ChannelDetails } = {
    iuiuoaiuh: {
        "id": "iuiuoaiuh",
        "snippet": {
            "title": "Yoooo",
            "description": "Some stuff",
            "thumbnails": {
                "default": {
                    "url": "https://yt3.ggpht.com/ytc/gha",
                    "width": 88,
                    "height": 88
                },
                "medium": {
                    "url": "https://yt3.ggpht.com/ytc/ayu",
                    "width": 240,
                    "height": 240
                },
                "high": {
                    "url": "https://yt3.ggpht.com/ytc/ryt",
                    "width": 800,
                    "height": 800
                }
            }
        },
        "contentDetails": {
            "relatedPlaylists": {
                "uploads": "eyuryejhhrje"
            }
        }
    },
    Gundi: {
        "id": "Gundi",
        "snippet": {
            "title": "Penicilin",
            "description": "",
            "thumbnails": {
                "default": {
                    "url": "https://yt3.ggpht.com/ytc/gha",
                    "width": 88,
                    "height": 88
                },
                "medium": {
                    "url": "https://yt3.ggpht.com/ytc/ayu",
                    "width": 240,
                    "height": 240
                },
                "high": {
                    "url": "https://yt3.ggpht.com/ytc/ryt",
                    "width": 800,
                    "height": 800
                }
            }
        },
        "contentDetails": {
            "relatedPlaylists": {
                "uploads": "anotherPlaylistId"
            }
        }
    },
    anotherChannelId2: {
        "id": "anotherChannelId2",
        "snippet": {
            "title": "Another Channel",
            "description": "Another",
            "thumbnails": {
                "default": {
                    "url": "https://yt3.ggpht.com/ytc/der",
                    "width": 88,
                    "height": 88
                },
                "medium": {
                    "url": "https://yt3.ggpht.com/ytc/fdere",
                    "width": 240,
                    "height": 240
                },
                "high": {
                    "url": "https://yt3.ggpht.com/ytc/adsaew",
                    "width": 800,
                    "height": 800
                }
            }
        },
        "contentDetails": {
            "relatedPlaylists": {
                "uploads": "anotherPlaylistId2"
            }
        }
    }
};

export const mockPlaylistItemListResponses: { [key: string]: { [key: string]: PlaylistItemListResponse } } = {
    eyuryejhhrje: {
        prevTok: {
            "nextPageToken": "aajhdaui",
            "pageInfo": {
                "totalResults": 39,
                "resultsPerPage": 1
            },
            "items": [
                {
                    "id": "OIUYUOhhldauiuwew",
                    "snippet": {
                        "title": "eywuyewew",
                        "description": "Woohoo",
                        "thumbnails": {
                            "default": {
                                "url": "https://i.ytimg.com/vi/jkds/default.jpg",
                                "width": 120,
                                "height": 90
                            },
                            "medium": {
                                "url": "https://i.ytimg.com/vi/skfjs/mqdefault.jpg",
                                "width": 320,
                                "height": 180
                            },
                            "high": {
                                "url": "https://i.ytimg.com/vi/sfkjsfs/hqdefault.jpg",
                                "width": 480,
                                "height": 360
                            }
                        },
                        "position": 0,
                        "resourceId": {
                            "videoId": "akjdajsu"
                        }
                    }
                },
            ]
        },
        aajhdaui: {
            "prevPageToken": "prevTok",
            "pageInfo": {
                "totalResults": 39,
                "resultsPerPage": 1
            },
            items: [
                {
                    "id": "adjkalusdaiuda",
                    "snippet": {
                        "title": "adyuaywejhwhe",
                        "description": "hdauiuweiwelw",
                        "thumbnails": {
                            "default": {
                                "url": "https://i.ytimg.com/vi/jhsd/default.jpg",
                                "width": 120,
                                "height": 90
                            },
                            "medium": {
                                "url": "https://i.ytimg.com/vi/jksjdhj/mqdefault.jpg",
                                "width": 320,
                                "height": 180
                            },
                            "high": {
                                "url": "https://i.ytimg.com/vi/jsdhs/hqdefault.jpg",
                                "width": 480,
                                "height": 360
                            }
                        },
                        "position": 1,
                        "resourceId": {
                            "videoId": "kjsjdjkshda"
                        }
                    }
                }
            ]
        }
    },
    anotherPlaylistId: {
        prevTok: {
            "pageInfo": {
                "totalResults": 2,
                "resultsPerPage": 2
            },
            "items": [
                {
                    "id": "djkaljdsa",
                    "snippet": {
                        "title": "Yeah",
                        "description": "Anhuh",
                        "thumbnails": {
                            "default": {
                                "url": "https://i.ytimg.com/vi/jkds/dsds.jpg",
                                "width": 120,
                                "height": 90
                            },
                            "medium": {
                                "url": "https://i.ytimg.com/vi/skfjs/sdseww.jpg",
                                "width": 320,
                                "height": 180
                            },
                            "high": {
                                "url": "https://i.ytimg.com/vi/sfkjsfs/dtrg.jpg",
                                "width": 480,
                                "height": 360
                            }
                        },
                        "position": 0,
                        "resourceId": {
                            "videoId": "fdfret"
                        }
                    }
                },
                {
                    "id": "adderevdv",
                    "snippet": {
                        "title": "Tarara",
                        "description": "Hey world",
                        "thumbnails": {
                            "default": {
                                "url": "https://i.ytimg.com/vi/jhsd/fdfjgfjhng.jpg",
                                "width": 120,
                                "height": 90
                            },
                            "medium": {
                                "url": "https://i.ytimg.com/vi/jksjdhj/fsgdgthrt.jpg",
                                "width": 320,
                                "height": 180
                            },
                            "high": {
                                "url": "https://i.ytimg.com/vi/jsdhs/gstgrgstr.jpg",
                                "width": 480,
                                "height": 360
                            }
                        },
                        "position": 1,
                        "resourceId": {
                            "videoId": "dfssfregr"
                        }
                    }
                }
            ]
        },
    }
}