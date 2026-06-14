import { useEffect, useState } from "react";
import { getPublicEvents } from "../../services/events.service";
import type { EventItem } from "../../types/event.types";

export function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getPublicEvents();
        setEvents(data);
      } catch {
        setErrorMessage("Could not load events");
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvents();
  }, []);

  return (
    <main
      style={{ minHeight: "100vh", background: "#0b0b10", color: "#ffffff" }}
    >
      <section
        style={{ padding: "80px 24px", maxWidth: "1180px", margin: "0 auto" }}
      >
        <p style={{ color: "#9ca3ff", fontWeight: 700 }}>Collective Platform</p>

        <h1
          style={{
            fontSize: "clamp(42px, 8vw, 96px)",
            lineHeight: 1,
            margin: "16px 0",
          }}
        >
          Modern cultural events platform
        </h1>

        <p
          style={{
            maxWidth: "720px",
            color: "#c7c7d1",
            fontSize: "20px",
            lineHeight: 1.7,
          }}
        >
          A modern collective website with events, gallery, videos, ticket
          links, and a full admin CMS.
        </p>
      </section>

      <section
        style={{
          padding: "40px 24px 100px",
          maxWidth: "1180px",
          margin: "0 auto",
        }}
      >
        <h2 style={{ fontSize: "40px", marginBottom: "32px" }}>
          Upcoming Events
        </h2>

        {isLoading && <p>Loading events...</p>}

        {errorMessage && <p style={{ color: "#ff7070" }}>{errorMessage}</p>}

        {!isLoading && !errorMessage && events.length === 0 && (
          <p>No published events yet.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {events.map((event) => (
            <article
              key={event._id}
              style={{
                background: "#171720",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "24px",
                overflow: "hidden",
              }}
            >
              {event.coverImage && (
                <img
                  src={event.coverImage.url}
                  alt={event.coverImage.alt?.en || event.title.en}
                  style={{
                    width: "100%",
                    height: "260px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              )}

              <div style={{ padding: "24px" }}>
                <p style={{ color: "#9ca3ff", fontStyle: "italic" }}>
                  {event.category || "Event"}
                </p>

                <h3 style={{ fontSize: "28px", margin: "8px 0" }}>
                  {event.title.en}
                </h3>

                <p style={{ color: "#c7c7d1", lineHeight: 1.6 }}>
                  {event.shortDescription.en}
                </p>

                <p style={{ marginTop: "18px", color: "#ffffff" }}>
                  {new Date(event.eventDate).toLocaleDateString("en-GB")} ·{" "}
                  {event.startTime}
                  {event.endTime ? ` - ${event.endTime}` : ""}
                </p>

                <p style={{ color: "#c7c7d1" }}>{event.location.en}</p>

                {event.ticketUrl && (
                  <a
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: "20px",
                      padding: "12px 18px",
                      borderRadius: "999px",
                      background: "#8b5cf6",
                      color: "#ffffff",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    Buy tickets
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
