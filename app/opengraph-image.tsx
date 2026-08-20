import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#ffffff",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            fontWeight: 700,
            color: "#ff4b1f",
            marginBottom: 20,
            letterSpacing: 2,
          }}
        >
          {site.role.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 900,
            color: "#0a0a0a",
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          Hi, I&apos;m
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 900,
            color: "#ff4b1f",
            lineHeight: 1,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          {site.firstName}.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#4a4a4a", maxWidth: 800 }}>
          {site.description}
        </div>
      </div>
    ),
    { ...size }
  );
}
