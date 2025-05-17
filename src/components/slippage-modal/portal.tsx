import React from "react";
import { createPortal } from "react-dom";

export function Portal({
  children,
  hostId = "modal-root",
}: {
  children: React.ReactNode;
  hostId?: string;
}) {
  // find or create the host node
  let host = document.getElementById(hostId);
  if (!host) {
    host = document.createElement("div");
    host.id = hostId;
    document.body.appendChild(host);
  }

  return createPortal(children, host);
}
