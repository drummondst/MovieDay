# ReelKnight — Setup Guide

## What's in this package

```
reelnight/
├── docker-compose.yml       # Two new containers: PocketBase + static frontend
├── nginx-proxy.conf         # Server block to add to your existing Nginx
├── pb_migrations/
│   └── 1_init.js            # Auto-creates DB collections on first boot
├── frontend/
│   └── index.html           # The full app
└── pb_data/                 # Created automatically — PocketBase database lives here
```

---

## Step 1 — Find your existing Docker network name

In Portainer, go to **Networks** and find the network your existing Nginx container is on.
It's usually named something like `nginx_default`, `proxy`, or `nginx-proxy_default`.

Edit `docker-compose.yml` and replace `YOUR_NGINX_NETWORK_NAME` with the real name:

```yaml
networks:
  proxy:
    external: true
    name: nginx_default   # ← your actual network name here
```

---

## Step 2 — Deploy the stack in Portainer

1. Copy the entire `reelnight/` folder to your server (e.g. `/opt/reelnight`)
2. In Portainer → **Stacks** → **Add stack**
3. Choose **Upload** and select `docker-compose.yml`, or use **Repository** / paste the contents
4. Set the working directory to `/opt/reelnight`
5. Deploy the stack

This starts:
- `reelnight_pb` — PocketBase on internal port 8090 (not exposed publicly)
- `reelnight_frontend` — Nginx serving the static files on internal port 80 (not exposed publicly)

---

## Step 3 — Add the Nginx server block

Copy the contents of `nginx-proxy.conf` into your existing Nginx config.

**If your Nginx uses conf.d includes:**
```bash
cp nginx-proxy.conf /path/to/nginx/conf.d/reelnight.conf
```

Then reload Nginx:
```bash
# If Nginx is in Docker:
docker exec <your_nginx_container> nginx -s reload

# Or via Portainer → container → Console → nginx -s reload
```

Edit the `server_name` line in the conf file to match your domain or local hostname.

---

## Step 4 — Set up PocketBase (first boot only)

1. Visit `http://your-domain/pb-admin/` (or `http://yourserver-ip/pb-admin/`)
2. Create an admin account — **do this immediately** to secure your instance
3. The migration script will have already created the `events`, `nominations`, and `votes` collections automatically

> **Tip:** After creating your admin account, consider restricting `/pb-admin/` in your Nginx config to your IP only.

---

## Step 5 — Get a TMDB API Key

The app needs a free TMDB key to search movies and fetch posters/trailers.

1. Sign up at [themoviedb.org](https://www.themoviedb.org)
2. Go to Settings → API → Request an API Key (choose "Developer")
3. When you create an event in the app, paste the key into the **TMDB API Key** field
4. The key is saved in your browser — you won't need to re-enter it

---

## Sharing with other users

Just share your URL — e.g. `http://reelnight.yourdomain.com` or `http://192.168.1.x`

All events, nominations, and votes are stored in PocketBase and shared across all visitors.
Users identify themselves by typing their name in the nav bar — no accounts needed.

---

## Ports summary

| Container            | Internal port | Exposed? |
|----------------------|--------------|----------|
| reelnight_pb         | 8090         | No — internal only |
| reelnight_frontend   | 80           | No — internal only |
| Your existing Nginx  | 80 / 443     | Yes — proxies both |

---

## Updating the app

To update the frontend, replace `frontend/index.html` and the change is live immediately
(Nginx serves it directly from the bind mount — no container restart needed).

To update PocketBase, change the image tag in `docker-compose.yml` and redeploy the stack.
