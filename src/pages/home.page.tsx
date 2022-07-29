import { ChannelBatchRefreshFunc, PlaylistItemBatchRefreshFunc } from "../types/funcs";

export default function HomePage(
    {
        refreshChannelBatch,
        refreshPlaylistItemBatch
    }: {
        refreshChannelBatch: ChannelBatchRefreshFunc,
        refreshPlaylistItemBatch: PlaylistItemBatchRefreshFunc
    }) {
    return (<div>Home</div>);

}