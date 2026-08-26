# @pipeworx/last-fm

[Last.fm](https://www.last.fm) MCP — artist / album / track metadata + scrobbling. Free API key (signed up at https://www.last.fm/api/account/create).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Auth

- Platform key: `PLATFORM_LASTFM_KEY`.
- BYO: `?_apiKey=…`.

## Tools

- `artist_info(artist, mbid?, lang?)` — artist bio + similar + tags
- `artist_top_tracks(artist, mbid?, limit?)` — most-played tracks for an artist
- `artist_similar(artist, mbid?, limit?)` — similar artists
- `album_info(artist, album, mbid?)` — album metadata
- `track_info(artist, track, mbid?)` — track metadata
- `track_search(query, limit?)` — track search
- `user_top_tracks(user, period?, limit?)` — user top tracks (period: overall|7day|1month|3month|6month|12month)
- `tag_top_artists(tag, limit?)` — top artists in a tag
- `chart_top_artists(limit?)` — global top artists

## Data source

`https://ws.audioscrobbler.com/2.0/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "last-fm": {
      "url": "https://gateway.pipeworx.io/last-fm/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/last-fm/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Last Fm data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
