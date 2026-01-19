package main //

import (
	"encoding/json" //
	"fmt"           //
	"net/http"      //
	"os"            //
	"os/exec"       //
	"path/filepath" //
	"strings"       //
)

// DATA STRUCTURES
type CommandResponse struct {
	Response string `json:"response"`
	Cwd      string `json:"cwd"`
}

type SaveRequest struct {
	Content string `json:"content"`
}

// GLOBAL STATE
var currentDir = "/home/joe/GhostLink/Lab/Vanilla-Frontend/static-terminal"

// --- THE NEW SIDEBAR ROUTE ---
func handleListFiles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	files, err := os.ReadDir(currentDir) // Read the directory Go is currently in
	if err != nil {
		http.Error(w, "Unable to scan directory", http.StatusInternalServerError)
		return
	}

	var fileNames []string
	for _, f := range files {
		if !f.IsDir() { // Only add files to the list
			fileNames = append(fileNames, f.Name())
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(fileNames) // Send JSON array to JS
}

// THE COMMAND HANDLER
func handleCommand(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	cmdInput := strings.TrimPrefix(r.URL.Path, "/cmd/")
	parts := strings.Fields(cmdInput)

	if len(parts) == 0 { return }

	if parts[0] == "cd" {
		target := "/"
		if len(parts) > 1 { target = parts[1] }
		os.Chdir(target)
		currentDir, _ = os.Getwd()
		json.NewEncoder(w).Encode(CommandResponse{Response: "Moved to " + currentDir, Cwd: currentDir})
		return
	}

	cmd := exec.Command("bash", "-c", cmdInput)
	output, err := cmd.CombinedOutput()
	response := string(output)
	if err != nil { response = err.Error() }

	json.NewEncoder(w).Encode(CommandResponse{Response: response, Cwd: currentDir})
}

// FILE READ/SAVE/THEME ROUTES
func handleRead(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	filename := strings.TrimPrefix(r.URL.Path, "/read/")
	content, err := os.ReadFile(filepath.Join(currentDir, filename))
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	w.Write(content)
}

func handleSave(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	if r.Method != http.MethodPost { return }
	filename := strings.TrimPrefix(r.URL.Path, "/save/")
	var req SaveRequest
	json.NewDecoder(r.Body).Decode(&req)
	err := os.WriteFile(filepath.Join(currentDir, filename), []byte(req.Content), 0644)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Fprintf(w, "Success")
}

func handleTheme(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	themeColor := strings.TrimPrefix(r.URL.Path, "/theme/")
	os.WriteFile("current_theme.txt", []byte(themeColor), 0644)
	fmt.Fprintf(w, "Theme updated")
}

func handleGetTheme(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	content, err := os.ReadFile("current_theme.txt")
	if err != nil {
		w.Write([]byte("cyan"))
		return
	}
	w.Write(content)
}

// THE RUST VITALS HANDLER
func handleVitals(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	cmd := exec.Command("./vitals")
	output, err := cmd.Output()
	if err != nil {
		http.Error(w, "Vitals binary missing", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(output)
}

func main() {
	http.HandleFunc("/cmd/", handleCommand)
	http.HandleFunc("/read/", handleRead)
	http.HandleFunc("/save/", handleSave)
	http.HandleFunc("/vitals", handleVitals)
	http.HandleFunc("/theme/", handleTheme)
	http.HandleFunc("/get-theme", handleGetTheme)
	http.HandleFunc("/list-files", handleListFiles) // Registering the Sidebar route
	
	fmt.Println("GHOST-LINK FORGE: Go Binary Listening on :8000") //
	http.ListenAndServe(":8000", nil)
}