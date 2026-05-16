import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RBA Diamond Growth Tracker",
    short_name: "RBA Diamond",
    description: "Diamond Member growth operating system for Royal Bengal Academy.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FBF5EA",
    theme_color: "#13233A",
    orientation: "portrait"
  };
}
