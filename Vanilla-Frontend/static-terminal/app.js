const termInput = document.getElementById("terminal-input");
const termBody = document.getElementById("terminal-body");
const cpuElement = document.getElementById("cpu-load");
const ramElement = document.getElementById("ram-usage");
const uptimeElement = document.getElementById("sys-uptime");

const OLD_COMMANDS = [];
let Num = 0;

termInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    // Extraction takin the text the user typed and stored it in a variable
    const commandText = termInput.value;

    OLD_COMMANDS.push(commandText);

    sendToPython(commandText);

    // Cleanup. Emptying the input box so its ready for the next command.
    termInput.value = "";

    Num = OLD_COMMANDS.length;
  } else if (event.key === "ArrowUp") {
    if (Num > 0) {
      Num--; /*Num = Num - 1;*/
      termInput.value = OLD_COMMANDS[Num];
    }
  } else if (event.key === "ArrowDown") {
    if (Num < OLD_COMMANDS.length) {
      Num++;
      termInput.value = OLD_COMMANDS[Num] || "";
    }
  }
});

document.getElementById("terminal-window").addEventListener("click", () => {
  termInput.focus();
});

function outputLine(text) {
  // Create a new empty paragraph element in the computer's memory
  const newLine = document.createElement("p");

  // Styling. Giving the new paragraph  the 'line' class so it looks like a line of code
  newLine.classList.add("line");

  // Population. Putting the user's text inside the new paragraph and adding alittle prefix.
  newLine.textContent = `> ${text}`;

  // Staple it to the body immediately
  termBody.appendChild(newLine);

  // Auto-scroll logic belongs here so it happens every time a line is added
  termBody.scrollTop = termBody.scrollHeight;
}

async function sendToPython(userText) {
  // So you're waiting for it to fetch the user's text and storing it in the response variable.
  const response = await fetch(`http://127.0.0.1:8000/cmd/${userText}`);

  // then you're waiting for the computer to turn the information into a readable JSON object and store it in the data variable?
  const data = await response.json();
  // now your having the old function we created print this data out?
  outputLine(data.response);
}

async function updateVitals() {
  const response = await fetch("http://127.0.0.1:8000/vitals");

  const data = await response.json();

  cpuElement.innerText = data.cpu;
  ramElement.innerText = data.ram;
  uptimeElement.innerText = data.uptime;
}

setInterval(updateVitals, 2000);
