import { Header } from "./Header";
import { useGitHubReleases } from "../hooks/useGitHubReleases";

const DOWNLOAD_DESCRIPTIONS: Record<string, string> = {
  "trinity-engine": "Custom build of Quake3e for flatscreen play (requires Trinity Mod)",
  trinity: "Custom Quake 3 mod with Trinity features",
  q3vr: "VR build for PC VR headsets",
  ioq3quest: "VR build for Meta Quest",
};

export function AboutPage() {
  const { releases } = useGitHubReleases();

  return (
    <div className="about-page">
      <Header title="About" className="about-header" />

      <div className="about-content">
        <div className="about-section">
          <h2>What is Trinity?</h2>
          <p>
            In short: a love letter to Quake 3 Arena, and the games of id
            Software, more generally. I'd argue that the rate at which PC gaming
            advanced during the 1990s has not really been matched, since. I
            don't think it would have happened without id. Certainly, not as
            quickly.
          </p>
          <p>
            This whole journey started after I rediscovered one of the greats in
            VR, thanks to <a href="https://quake3.quakevr.com">Quake3Quest</a>,
            and then <a href="https://ripper37.github.io/q3vr/">Quake 3 VR</a>.
            I wanted to port some{" "}
            <a href="https://github.com/ec-/baseq3a">baseq3a</a> features over
            to it. That led to another idea, and another. And, well, here we
            are. I hope a new generation of players get to experience a Quake 3
            Arena even better than it was, originally, as a result.
          </p>
          <p>
            Downloading is the only way to enjoy all Trinity features. The VR
            builds include everything you need. For flatscreen play, you'll want
            both the engine and the mod. This site is powered by{" "}
            <a href="https://github.com/ernie/trinity-tools">trinity-tracker</a>,
            which is also open source. Stop by the{" "}
            <a href="https://discord.gg/tuDB2YNc7h">Team Beef Discord</a> if
            you have questions or want to connect.
          </p>
          <div className="about-downloads">
            {releases.map((r) => (
              <a
                key={r.repo}
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
                        Trinity mod + engine included
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
            ))}
          </div>
        </div>

        <div className="about-section">
          <h2>Who made this?</h2>
          <p>
            I'm NilClass. Or, occasionally, I go by{" "}
            <a href="https://ernie.io">Ernie Miller</a>. But really, the folks
            who made this are the people who built the projects my work is based
            on:
            <ul>
              <li>
                Team Beef:{" "}
                <a href="https://github.com/Team-Beef-Studios/ioq3quest">
                  Quake3Quest
                </a>
              </li>
              <li>
                RippeR37:{" "}
                <a href="https://github.com/rippeR37/q3vr/">Quake 3 VR</a>
              </li>
              <li>
                ec-: <a href="https://github.com/ec-/quake3e">Quake3e</a> and{" "}
                <a href="https://github.com/ec-/baseq3a">baseq3a</a>
              </li>
              <li>
                Kr3m:{" "}
                <a href="https://github.com/Kr3m/missionpackplus">
                  missionpackplus
                </a>
              </li>
              <li>
                Everyone involved in the{" "}
                <a href="https://github.com/ioquake/ioq3">ioquake3</a> project
                over the years
              </li>
            </ul>
          </p>
        </div>

        <div className="about-section">
          <h2>Please don't sue me.</h2>
          <p>
            Trinity is not affiliated, associated, authorized, endorsed by, or
            in any way officially connected with Bethesda or id Software, or any
            of its subsidiaries or its affiliates. Quake 3, Quake 3 Arena, id,
            id Software, id Tech and related logos are registered trademarks or
            trademarks of id Software LLC in the U.S. and/or other countries.
            All Rights Reserved.
          </p>
        </div>
      </div>

    </div>
  );
}
