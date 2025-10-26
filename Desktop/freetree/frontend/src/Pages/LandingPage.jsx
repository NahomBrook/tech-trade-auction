import React from "react";
import "./LandingPage.css";

export default function LandingPage() {
    const placeholderImages = [
        "/Images/photo1.png",
        "/Images/photo2.png",
        "/Images/photo3.png",
        "/Images/photo4.png",
        "/Images/photo5.png",
    ];

    const whatWeDo = [
        { title: "Tree Planting", desc: "Community-driven planting events." },
        { title: "Education", desc: "Workshops and resources on urban forestry." },
        { title: "Advocacy", desc: "Policy initiatives for greener cities." },
        { title: "Mapping", desc: "Track trees and greenspaces in your area." },
        { title: "Volunteer Ops", desc: "Join local crews and programs." },
        { title: "Donations", desc: "Support tree projects financially." },
    ];

    return (
        <div className="lp-root">
            {/* NAVIGATION */}
            <nav className="lp-nav">
                <div className="lp-logo">🌱 FreeTree</div>
                <div className="lp-nav-links">
                    <a href="#signup" className="btn ghost">Sign Up</a>
                    <a href="#signin" className="btn primary">Sign In</a>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="lp-hero">
                <div className="lp-hero-inner">
                    <div className="lp-hero-text">
                        <h1>Grow Greener Neighborhoods Together</h1>
                        <p>
                            FreeTree connects volunteers, organizers, and donors to plant and
                            care for urban trees. Join us to make your city healthier and
                            cooler—one tree at a time.
                        </p>
                        <div className="lp-hero-ctas">
                            <a href="#signup" className="btn primary large">Get Started</a>
                            <a href="#learn" className="btn ghost">Learn More</a>
                        </div>
                    </div>

                    <div className="lp-hero-marquee">
                        <div className="marquee-track">
                            <div className="marquee-group">
                                {placeholderImages.map((src, i) => (
                                    <img key={"a" + i} src={src} alt={`photo ${i + 1}`} />
                                ))}
                            </div>
                            <div className="marquee-group">
                                {placeholderImages.map((src, i) => (
                                    <img key={"b" + i} src={src} alt={`photo duplicate ${i + 1}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT WE DO */}
            <section className="lp-whatwedo" id="what-we-do">
                <h2>What We Do</h2>
                <p className="lp-sub">Practical actions we take to cultivate green spaces.</p>

                <div className="grid">
                    {whatWeDo.map((item, idx) => (
                        <div key={idx} className="card">
                            <div className="icon" aria-hidden="true">🌳</div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="lp-footer">
                <div className="footer-grid">
                    <div>
                        <h4>FreeTree</h4>
                        <p>Planting hope, one tree at a time.</p>
                    </div>

                    <div>
                        <h5>Explore</h5>
                        <ul>
                            <li><a href="#what-we-do">What we do</a></li>
                            <li><a href="#volunteer">Volunteer</a></li>
                            <li><a href="#events">Events</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5>Community</h5>
                        <ul>
                            <li><a href="#partners">Partners</a></li>
                            <li><a href="#blog">Blog</a></li>
                            <li><a href="#support">Support</a></li>
                        </ul>
                    </div>

                    <div>
                        <h5>Legal</h5>
                        <ul>
                            <li><a href="#terms">Terms</a></li>
                            <li><a href="#privacy">Privacy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="lp-footer-bottom">
                    <small>© {new Date().getFullYear()} FreeTree — All rights reserved.</small>
                </div>
            </footer>
        </div>
    );
}
