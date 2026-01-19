// --- GHOST-LINK FRONTEND ENGINE (TS VERSION) ---
// [2026-01-18] Full Feature Set: Vitals, File I/O, Touch, RM.

interface Vitals {
  cpu: string;
  ram: string;
  uptime: string;
}

document.addEventListener("DOMContentLoaded", () => {
  // DOM Selection
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

  // --- REFRESH LOGIC ---
  async function refreshFiles(): Promise<void> {
    try {
      const response = await fetch("http://127.0.0.1:8000/files");
      const files: string[] = await response.json();
      const fileListContainer = document.querySelector(
        ".file-list",
      ) as HTMLElement;
      fileListContainer.innerHTML = "";

      files.forEach((fileName) => {
        const div = document.createElement("div");
        div.className = "file-item";
        div.innerText = fileName;
        div.onclick = () => {
          document
            .querySelectorAll(".file-item")
            .forEach((el) => el.classList.remove("active"));
          div.classList.add("active");
          openFile(fileName);
        };
        fileListContainer.appendChild(div);
      });
    } catch (err) {
      console.error("File list sync failed");
    }
  }

  // --- CORE FILE ACTIONS ---
  async function openFile(name: string): Promise<void> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/read/${name}`);
      textArea.value = await response.text();
      fileNameDisplay.innerText = `Editing: ${name}`;
      editor.style.display = "flex"; // Reveals sidebar + editor
      textArea.focus();
    } catch (err) {
      logToTerminal(`Read Error: ${name}`);
    }
  }

  async function saveFile(): Promise<void> {
    const name = fileNameDisplay.innerText.replace("Editing: ", "");
    try {
      const response = await fetch(`http://127.0.0.1:8000/save/${name}`, {
        method: "POST",
        body: textArea.value,
      });
      if ((await response.text()) === "Success")
        logToTerminal(`Saved: ${name}`);
    } catch (err) {
      logToTerminal("Save Error");
    }
  }

  async function createFile(name: string): Promise<void> {
    try {
      const response = await fetch(`http://127.0.0.1:8000/create/${name}`, {
        method: "POST",
      });
      const res = await response.text();
      if (res === "Success") {
        logToTerminal(`Created: ${name}`);
        refreshFiles();
      } else {
        logToTerminal(res);
      }
    } catch (err) {
      logToTerminal("Creation Error");
    }
  }

  async function deleteFile(name: string): Promise<void> {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/delete/${name}`, {
        method: "POST",
      });
      if ((await response.text()) === "Success") {
        logToTerminal(`Removed: ${name}`);
        refreshFiles();
        if (fileNameDisplay.innerText.includes(name))
          editor.style.display = "none";
      }
    } catch (err) {
      logToTerminal("Deletion Error");
    }
  }

  // --- TERMINAL LOGIC ---
  function logToTerminal(msg: string): void {
    const p = document.createElement("p");
    p.className = "line";
    p.innerText = `[SYS] ${msg}`;
    termBody.appendChild(p);
    termBody.scrollTop = termBody.scrollHeight;
  }

  termInput.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      const [cmd, arg] = termInput.value.trim().split(" ");
      if (cmd === "edit") openFile(arg || "index.html");
      else if (cmd === "touch") createFile(arg);
      else if (cmd === "rm") deleteFile(arg);
      else if (cmd === "clear") termBody.innerHTML = "";
      else logToTerminal(`Unknown: ${cmd}`);
      termInput.value = "";
    }
  });

  // Vitals Loop
  setInterval(async () => {
    const res = await fetch("http://127.0.0.1:8000/vitals");
    const data: Vitals = await res.json();
    document.getElementById("cpu-load")!.innerText = data.cpu;
    document.getElementById("ram-usage")!.innerText = data.ram;
    document.getElementById("sys-uptime")!.innerText = data.uptime;
  }, 2000);

  // Initial Load
  refreshFiles();
  (window as any).saveFile = saveFile;
});
