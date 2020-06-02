import { PlaylistClass } from "./playlist";

export let playlistDefault = new PlaylistClass({})

export function setPlaylistDefault (p: PlaylistClass) {
  playlistDefault = p
}