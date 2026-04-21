# VPS Deployment — RefillWatch

Fully reproducible deployment of the Astro site to a Linux VPS with
auto-SSL, git-based updates, and basic monitoring. Assumes Ubuntu 22.04+,
but the commands port to any Debian-based distro.

---

## 0. What you'll end up with

- `refillwatch.org` and `www.refillwatch.org` both serving the
  site over HTTPS with auto-renewing Let's Encrypt certificates
- A single `git push origin main` on your laptop triggers a rebuild on
  the VPS within 60 seconds
- The scout running on a schedule, dropping fresh JSON into the site,
  with the build picking up new products automatically
- Nothing runs as root

---

## 1. Point DNS to the VPS (do this first — propagation takes a while)

In your registrar (Cloudflare recommended):

1. Set `refillwatch.org` A record to your VPS public IP.
2. Set `www.refillwatch.org` CNAME to `refillwatch.org`.
3. TTL: 300 seconds while you're setting things up, raise to 3600 later.

If using Cloudflare, set the proxy status to **DNS only (gray cloud)**
during initial setup so Caddy can issue its own certs. You can flip it
to Proxied later if you want Cloudflare's WAF, but it's not required.

Check propagation from your laptop:
```bash
dig refillwatch.org +short
```

---

## 2. Create a non-root user on the VPS

SSH in as root (or your existing admin user). Then:

```bash
adduser deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

Log out and back in as `deploy` for everything below.

---

## 3. Install the runtime dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git build-essential python3 python3-pip python3-venv ufw

# Node 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Caddy web server (auto-SSL)
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy

node --version   # should be v20.x
caddy version
```

Firewall:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 4. Clone the repos

Assumes you've pushed `refillwatch` (Astro site) and
`amazon-affiliate-scout` (scout) to GitHub. Create deploy keys on the
VPS and add them to both repos:

```bash
ssh-keygen -t ed25519 -C "deploy@vps" -f ~/.ssh/id_deploy
cat ~/.ssh/id_deploy.pub
# -> Paste into GitHub: repo Settings -> Deploy keys (read-only is fine)
```

Then clone:

```bash
cd ~
git clone git@github.com:YOUR_USERNAME/refillwatch.git
git clone git@github.com:YOUR_USERNAME/amazon-affiliate-scout.git
```

---

## 5. First build

```bash
cd ~/refillwatch
npm install
npm run build
```

If that succeeds you now have a `dist/` folder. This is what Caddy will serve.

Test locally first:
```bash
npx astro preview --host 127.0.0.1 --port 4321
# then from your laptop:  curl -I http://YOUR_VPS_IP:4321
```

---

## 6. Configure Caddy

```bash
sudo tee /etc/caddy/Caddyfile > /dev/null <<'EOF'
refillwatch.org, www.refillwatch.org {
    root * /home/deploy/refillwatch/dist
    file_server
    encode zstd gzip

    # Redirect www -> apex
    @www host www.refillwatch.org
    redir @www https://refillwatch.org{uri} permanent

    # Strong security headers
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "interest-cohort=()"
        X-Frame-Options "SAMEORIGIN"
    }

    # Cache static assets aggressively
    @static path *.css *.js *.png *.jpg *.jpeg *.webp *.svg *.woff2 *.ico
    header @static Cache-Control "public, max-age=31536000, immutable"

    # Cache HTML briefly so updates propagate without being stale forever
    @html path *.html
    header @html Cache-Control "public, max-age=300, must-revalidate"

    log {
        output file /var/log/caddy/secondspring.log
        format json
    }
}
EOF

sudo systemctl reload caddy
sudo systemctl status caddy
```

Caddy will automatically request and renew Let's Encrypt certs. First
provisioning takes 30-90 seconds. Visit `https://refillwatch.org`
from a browser to verify.

Grant Caddy access to the site files:
```bash
sudo chmod o+rx /home/deploy
```

---

## 7. Git-based auto-deploy (simplest version)

A tiny update script that pulls, rebuilds, and (only if build succeeds)
swaps the `dist/` into place.

```bash
mkdir -p ~/bin
cat > ~/bin/deploy-site.sh <<'EOF'
#!/bin/bash
set -euo pipefail
cd /home/deploy/refillwatch
git fetch --quiet origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
if [ "$LOCAL" = "$REMOTE" ]; then
    exit 0
fi
git reset --hard origin/main
npm install --no-audit --no-fund --silent
npm run build
echo "[$(date -Iseconds)] Deployed $(git rev-parse --short HEAD)" >> /home/deploy/deploy.log
EOF
chmod +x ~/bin/deploy-site.sh
```

Run every minute via cron (safe — exits immediately when there's nothing
new). Edit crontab with `crontab -e`:

```
* * * * * /home/deploy/bin/deploy-site.sh >> /home/deploy/deploy.log 2>&1
```

Now `git push origin main` from your laptop = live on site within 60s.

If you want faster than 60s or don't want polling, swap this for a
GitHub webhook + systemd service. Polling is simpler and fine for a
solo-operator site.

---

## 8. Scout on a schedule

```bash
cd ~/amazon-affiliate-scout
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt keepa
deactivate
```

Put your secrets in an env file the cron job will source:

```bash
cat > ~/.scout-env <<'EOF'
export AMAZON_ASSOCIATE_TAG="refillwatch-20"
export KEEPA_API_KEY="your_keepa_key_here"
export SCOUT_SOURCE="keepa"
export ASTRO_CONTENT_DIR="/home/deploy/refillwatch/src/content"
EOF
chmod 600 ~/.scout-env
```

Wrapper script:

```bash
cat > ~/bin/run-scout.sh <<'EOF'
#!/bin/bash
set -euo pipefail
source /home/deploy/.scout-env
cd /home/deploy/amazon-affiliate-scout
source .venv/bin/activate

# Pull fresh products; then regenerate Astro Markdown for the top scorers.
python -m scout.cli scout --max 400
python -m scout.cli generate --top 100 --per-category 15

# Commit and push the updated content so the site auto-rebuilds.
cd /home/deploy/refillwatch
if [ -n "$(git status --porcelain)" ]; then
    git add src/content/
    git commit -m "scout: auto-refresh product inventory"
    git push origin main
    echo "[$(date -Iseconds)] pushed scout refresh" >> /home/deploy/scout.log
else
    echo "[$(date -Iseconds)] no changes from scout" >> /home/deploy/scout.log
fi
EOF
chmod +x ~/bin/run-scout.sh
```

Schedule the scout to run twice a week. Add to `crontab -e`:

```
0 6 * * 1,4 /home/deploy/bin/run-scout.sh >> /home/deploy/scout.log 2>&1
```

Mondays and Thursdays at 06:00 UTC. Burns ~10-15k Keepa tokens per run
on the Start plan.

You'll need git credentials for the VPS to push. Easiest: create a
second deploy key on GitHub with write access, or a fine-grained PAT.

---

## 9. Basic monitoring

Free uptime monitor: UptimeRobot.com, set to ping
`https://refillwatch.org` every 5 minutes and alert your phone.

Free log-tail dashboard: run `sudo journalctl -u caddy -f` to watch
requests live, or install Dozzle if you prefer a web UI.

Basic server metrics: `htop`, `ncdu`, and `journalctl --since "1 hour ago"`
cover 95% of what you'll ever need on a small site. If the site ever
sees real traffic, consider Netdata (free, one-line install).

---

## 10. Backups

The entire site regenerates from the two Git repos, so as long as those
are pushed to GitHub you're fine. Two things that aren't in Git and
deserve their own backup:

```bash
# Scout storage — the running product database.
rsync -av ~/amazon-affiliate-scout/data/ user@backup-host:/backups/scout/

# Env files with API keys.
# Just copy ~/.scout-env to a password manager once; it almost never changes.
```

Run the rsync weekly via cron if you want. Or don't — the scout's state
rebuilds itself from Keepa within a few hours if you ever lose it.

---

## 11. Common problems and fixes

**Caddy won't get a cert:** DNS hasn't propagated or Cloudflare proxy is on.
`dig +short refillwatch.org` should return your VPS IP, not a
Cloudflare IP, during first provisioning.

**npm install fails with permission errors:** Don't run it with sudo.
Always as the `deploy` user in `~/refillwatch`.

**Astro build fails with "Cannot find module '@/...":** The `paths` alias
needs `tsconfig.json` present. Already included; if you edit it, keep
the `baseUrl` and `paths` keys.

**Site deployed but shows a blank page:** Usually means `dist/` is empty
because the build failed silently. Run `npm run build` manually and read
the full output.

**Scout is slow or errors on Keepa:** Check your token balance at
`https://keepa.com/#!api`. Wait for refill if you've spent out, or
upgrade the plan.

---

## 12. What good looks like 30 days in

- `https://refillwatch.org` serving with valid SSL
- 100+ product review files under `src/content/products/`
- 6-8 pillar files under `src/content/pillars/`
- 30+ article files under `src/content/articles/`
- Google Search Console verifying the sitemap at `/sitemap-index.xml`
- Pinterest account linked, pinning daily
- First few Amazon clicks showing up in the Associates dashboard

If you're there, you're on track. Everything else is iteration.
