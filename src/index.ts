interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Last.fm MCP.
 */


const BASE = 'https://ws.audioscrobbler.com/2.0/';
const UA = 'pipeworx-mcp-last-fm/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'artist_info', description: 'Artist bio + similar + tags.', inputSchema: { type: 'object', properties: { artist: { type: 'string' }, mbid: { type: 'string' }, lang: { type: 'string' } }, required: ['artist'] } },
  { name: 'artist_top_tracks', description: 'Most-played tracks for an artist.', inputSchema: { type: 'object', properties: { artist: { type: 'string' }, mbid: { type: 'string' }, limit: { type: 'number' } }, required: ['artist'] } },
  { name: 'artist_similar', description: 'Similar artists.', inputSchema: { type: 'object', properties: { artist: { type: 'string' }, mbid: { type: 'string' }, limit: { type: 'number' } }, required: ['artist'] } },
  { name: 'album_info', description: 'Album metadata.', inputSchema: { type: 'object', properties: { artist: { type: 'string' }, album: { type: 'string' }, mbid: { type: 'string' } }, required: ['artist', 'album'] } },
  { name: 'track_info', description: 'Track metadata.', inputSchema: { type: 'object', properties: { artist: { type: 'string' }, track: { type: 'string' }, mbid: { type: 'string' } }, required: ['artist', 'track'] } },
  { name: 'track_search', description: 'Track search.', inputSchema: { type: 'object', properties: { query: { type: 'string' }, limit: { type: 'number' } }, required: ['query'] } },
  { name: 'user_top_tracks', description: 'User top tracks.', inputSchema: { type: 'object', properties: { user: { type: 'string' }, period: { type: 'string' }, limit: { type: 'number' } }, required: ['user'] } },
  { name: 'tag_top_artists', description: 'Top artists in a tag.', inputSchema: { type: 'object', properties: { tag: { type: 'string' }, limit: { type: 'number' } }, required: ['tag'] } },
  { name: 'chart_top_artists', description: 'Global top artists.', inputSchema: { type: 'object', properties: { limit: { type: 'number' } } } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = (args._apiKey as string | undefined)?.trim();
  if (!apiKey) throw new Error('Last.fm requires an API key. Set PLATFORM_LASTFM_KEY or pass ?_apiKey=… (free at https://www.last.fm/api/account/create).');
  const method = ({
    artist_info: 'artist.getInfo',
    artist_top_tracks: 'artist.getTopTracks',
    artist_similar: 'artist.getSimilar',
    album_info: 'album.getInfo',
    track_info: 'track.getInfo',
    track_search: 'track.search',
    user_top_tracks: 'user.getTopTracks',
    tag_top_artists: 'tag.getTopArtists',
    chart_top_artists: 'chart.getTopArtists',
  } as Record<string, string>)[name];
  if (!method) throw new Error(`Unknown tool: ${name}`);

  const p = new URLSearchParams({ method, api_key: apiKey, format: 'json' });
  for (const [k, v] of Object.entries(args)) {
    if (k === '_apiKey' || k === 'query') continue;
    if (v == null) continue;
    p.set(k, String(v));
  }
  if (name === 'track_search' && args.query) p.set('track', String(args.query));

  const res = await fetch(`${BASE}?${p}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (res.status === 403) throw new Error('Last.fm: 403 — invalid API key.');
  if (!res.ok) throw new Error(`Last.fm: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
  const json = (await res.json()) as { error?: number; message?: string };
  if (json.error) throw new Error(`Last.fm: ${json.message ?? `error ${json.error}`}`);
  return json;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
