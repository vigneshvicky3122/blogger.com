import React, { useEffect } from "react";
import icon from "../assets/blogger.png";
function Modal({ Message }) {
  return (
    <>
      <div class="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          class="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div class="toast-header">
            <img src={icon} class="rounded me-2" alt="icon" />
            <strong class="me-auto">Blogger.com</strong>
            <small>1 mins ago</small>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div class="toast-body">{Message}</div>
        </div>
      </div>
    </>
  );
}

export default Modal;
