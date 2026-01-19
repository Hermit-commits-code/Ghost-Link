// --- GHOST-LINK FRONTEND ENGINE (TS VERSION) ---
// [2026-01-18] Fix: Added DOMContentLoaded wrapper and null-checks.

interface Vitals {
  cpu: string;
  ram: string;
  uptime: string;
}

// Wrap everything in an initializer to prevent "null" errors during load
document.addEventListener("DOMContentLoaded", () => {
  // Select DOM Elements with explicit Type Casting
  const termInput = document.getElementById(
    "terminal-input",
  ) as HTMLInputElement;
  const termBody = document.getElementById("terminal-body") as HTMLElement;
  const editor = document.getElementById("editor-container") as HTMLElement;
  const textArea = document.getElementById(
    "editor-textarea",
  ) as HTMLTextAreaElement;
  const fileNameDisplay = document.getElementById(
    "editor-filename",
  ) as HTMLElement;

  /**
   * FETCH VITALS: Requests hardware data from Rust
   */
  async function fetchVitals(): Promise<void> {
    try {
      const response = await fetch("http://127.0.0.1:8000/vitals");
      const data: Vitals = await response.json();

      // Use Optional Chaining (?.) or Non-null Assertion (!) to satisfy TS
      if (document.getElementById("cpu-load")) {
        document.getElementById("cpu-load")!.innerText = data.cpu;
        document.getElementById("ram-usage")!.innerText = data.ram;
        document.getElementById("sys-uptime")!.innerText = data.uptime;
      }
    } catch (err) {
      console.warn("Ghost-Link Backend Offline");
    }
  }

  /**
   * OPEN FILE: Requests file content from Rust /read/:filename
   */
  async function openFile(name: string): Promise<void> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/read/${name}`);
      const content = await response.text();

      fileNameDisplay.innerText = `Editing: ${name}`;
      textArea.value = content;
      editor.style.display = "flex"; // Triggers CSS Overlay
      textArea.focus();
    } catch (err) {
      logToTerminal(`Failed to open: ${name}`);
    }
  }

  /**
   * SAVE FILE: Sends content to Rust /save/:filename
   */
  async function saveFile(): Promise<void> {
    const name = fileNameDisplay.innerText.replace("Editing: ", "");
    const body = textArea.value;

    try {
      const response = await fetch(`http://127.0.0.1:8000/save/${name}`, {
        method: "POST",
        body: body,
      });
      const result = await response.text();
      if (result === "Success") logToTerminal(`Disk Write: ${name} [OK]`);
    } catch (err) {
      logToTerminal("Disk Write Error");
    }
  }

  function logToTerminal(msg: string): void {
    const line = document.createElement("p");
    line.className = "line";
    line.innerText = `[SYS] ${msg}`;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
  }

  // Command Listener
  termInput.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const val = termInput.value.trim();
      const [cmd, arg] = val.split(" ");

      if (cmd === "edit") {
        openFile(arg || "index.html");
      } else if (cmd === "clear") {
        termBody.innerHTML = "";
      } else {
        logToTerminal(`Unknown command: ${cmd}`);
      }
      termInput.value = "";
    }
  });

  // Global Shortcut Listener
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      saveFile();
    }
    if (e.key === "Escape") {
      editor.style.display = "none";
      termInput.focus();
    }
  });

  // Expose saveFile to the window so the HTML 'onclick' can see it
  (window as any).saveFile = saveFile;

  // Start Loops
  setInterval(fetchVitals, 2000);
});
