"use client";

import Swal from "sweetalert2";

// A confirmation dialog for actions that cannot be undone. Resolves to true when the user agrees.
export async function confirmAction({ title, text, confirmText = "Yes, continue", danger = true }) {
  const result = await Swal.fire({
    title,
    text,
    icon: danger ? "warning" : "question",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Cancel",
    reverseButtons: true,
    buttonsStyling: false,
    background: "var(--color-base-100)",
    color: "var(--color-base-content)",
    customClass: {
      popup: "rounded-box",
      actions: "gap-3",
      confirmButton: danger ? "btn btn-error" : "btn btn-primary",
      cancelButton: "btn btn-ghost",
    },
  });
  return result.isConfirmed;
}
