# @pipeworx/last-fm

[Last.fm](https://www.last.fm) MCP — artist / album / track metadata + scrobbling. Free API key (signed up at https://www.last.fm/api/account/create).

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Last Fm data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
