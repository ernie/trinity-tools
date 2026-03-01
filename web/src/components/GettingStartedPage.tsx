import { Header } from "./Header";
import { useGitHubReleases } from "../hooks/useGitHubReleases";

const DOWNLOAD_DESCRIPTIONS: Record<string, string> = {
  trinity: "Custom Quake 3 mod with Trinity features",
  "trinity-engine": "Flatscreen engine based on Quake3e",
  q3vr: "VR engine for PC VR headsets",
  ioq3quest: "VR engine for Meta Quest (2, 3, or 3S)",
};

export function GettingStartedPage() {
  const { releases } = useGitHubReleases();

  return (
    <div className="about-page">
      <Header title="Getting Started" className="about-header" />

      <div className="about-content">
        <div className="about-section">
          <h2>Install or Update Trinity</h2>
          <p>
            Downloading these builds is the only way to enjoy all Trinity
            features. All engine downloads include the Trinity mod that was
            current at time of release. Stop by the{" "}
            <a href="https://discord.gg/tuDB2YNc7h">Team Beef Discord</a> if you
            have questions or want to connect.
          </p>
          <div className="about-downloads">
            {releases.map((r) => (
              <div key={r.repo}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-download-item"
                >
                  <div className="about-download-info">
                    <span className="about-download-name">
                      {r.displayName}
                      {r.bundled && (
                        <span className="about-download-bundled">
                          <img
                            src="/assets/icon-128.png"
                            alt=""
                            className="about-download-bundled-icon"
                          />
                          Includes Trinity mod
                        </span>
                      )}
                    </span>
                    <span className="about-download-desc">
                      {DOWNLOAD_DESCRIPTIONS[r.repo]}
                    </span>
                  </div>
                  {r.version && (
                    <span className="about-download-version">{r.version}</span>
                  )}
                </a>
                {r.repo === "trinity" && (
                  <div className="about-download-install-note">
                    Copy <code>pak8t.pk3</code> to your <code>baseq3</code>{" "}
                    folder and <code>pak3t.pk3</code> to your{" "}
                    <code>missionpack</code> folder.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="about-section">
          <h2>Game Files</h2>
          <p>
            Trinity includes all of the free content needed to play online, but
            if you own Quake 3 Arena or Quake 3: Team Arena, you can copy your
            retail <code>.pk3</code> files into the install directory for the
            full game experience, including the single-player campaign and many
            additional maps. Most public servers are dedicated to full game
            clients, so having these files also means you can play on the
            majority of them. The{" "}
            <a href="https://store.steampowered.com/app/2200/Quake_III_Arena/">
              Steam version of Quake 3 Arena
            </a>{" "}
            includes both Q3A and Team Arena.
          </p>
          <ul>
            <li>
              Copy your Quake 3 Arena <code>.pk3</code> files to the{" "}
              <code>baseq3</code> folder
            </li>
            <li>
              Copy your Team Arena <code>.pk3</code> files to the{" "}
              <code>missionpack</code> folder
            </li>
          </ul>
          <p>
            These files are typically named <code>pak0.pk3</code> through{" "}
            <code>pak8.pk3</code> for Quake 3 Arena and{" "}
            <code>pak0.pk3</code> through <code>pak3.pk3</code> for Team Arena.
            You can find them in your existing Quake 3 install directory, or
            from a Steam or GOG copy of the game.
          </p>
        </div>

        <div className="about-section">
          <h2>Your Player Identity (GUID)</h2>
          <p>
            Your GUID is how Trinity identifies you. It's generated from a{" "}
            <code>qkey</code> file unique to your installation. If you play on
            multiple devices or engines, each one will generate its own{" "}
            <code>qkey</code>, giving you a different identity on each.
          </p>
          <p>To keep a consistent identity across installations:</p>
          <ul>
            <li>
              Copy your <code>qkey</code> file between installations so they
              share the same identity
            </li>
            <li>
              Set <code>cl_guidServerUniq 0</code> in your config for a
              consistent GUID across all servers
            </li>
          </ul>
          <p>
            Trinity Engine defaults <code>cl_guidServerUniq</code> to{" "}
            <code>0</code>, so no action is needed there. Quake 3 VR and
            Quake3Quest default to <code>1</code>, which produces a different
            GUID per server — setting it to <code>0</code> is recommended.
          </p>
          <p>
            If you end up with multiple GUIDs, you can link them together on
            your <a href="/account">Account</a> page.
          </p>
        </div>
      </div>
    </div>
  );
}
