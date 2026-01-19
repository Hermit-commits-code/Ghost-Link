// --- GHOST-LINK CORE: RUST SYSTEMS ENGINE ---
// [2026-01-18] Updated: Added Create and Delete protocols.
use axum::{
    extract::Path,
    routing::{get, post},
    Json, Router,
};
use serde_json::{json, Value};
use std::fs;
use std::net::SocketAddr;
use sysinfo::System;
use tower_http::cors::CorsLayer;
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() {
    // Initialize the Router with all Industrial Routes
    let app = Router::new()
        .route("/vitals", get(get_vitals))
        .route("/files", get(list_files))
        .route("/read/:filename", get(read_file))
        .route("/save/:filename", post(save_file))
        .route("/create/:filename", post(create_file))
        .route("/delete/:filename", post(delete_file))
        // Serve the static frontend folder
        .fallback_service(ServeDir::new("src/static"))
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([127, 0, 0, 1], 8000));
    println!("GHOST-LINK CORE: Engine Ignition at http://{}", addr);

    // This is where the panic happens if the port is busy
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// --- HANDLERS ---

async fn get_vitals() -> Json<Value> {
    let mut sys = System::new_all();
    sys.refresh_all();
    Json(json!({
        "cpu": format!("{:.1}%", sys.global_cpu_usage()),
        "ram": format!("{:.1}%", (sys.used_memory() as f64 / sys.total_memory() as f64) * 100.0),
        "uptime": format!("{}s", System::uptime())
    }))
}

async fn list_files() -> Json<Value> {
    let paths = fs::read_dir("src/static").unwrap();
    let mut files = Vec::new();
    for path in paths {
        if let Ok(entry) = path {
            if let Ok(name) = entry.file_name().into_string() {
                // Filter out the compiled folder and hidden files
                if name != "dist" && !name.starts_with('.') {
                    files.push(name);
                }
            }
        }
    }
    Json(json!(files))
}

async fn read_file(Path(filename): Path<String>) -> String {
    fs::read_to_string(format!("src/static/{}", filename))
        .unwrap_or_else(|_| "Error: File not found".to_string())
}

async fn save_file(Path(filename): Path<String>, body: String) -> String {
    match fs::write(format!("src/static/{}", filename), body) {
        Ok(_) => "Success".to_string(),
        Err(e) => format!("Error: {}", e),
    }
}

async fn create_file(Path(filename): Path<String>) -> String {
    let path = format!("src/static/{}", filename);
    if std::path::Path::new(&path).exists() {
        return "Error: File already exists".to_string();
    }
    match fs::write(&path, "") {
        Ok(_) => "Success".to_string(),
        Err(e) => format!("Error: {}", e),
    }
}

async fn delete_file(Path(filename): Path<String>) -> String {
    let path = format!("src/static/{}", filename);
    // Safety check for core files
    if filename == "index.html" || filename == "style.css" || filename == "app.js" {
        return "Error: Cannot delete core system files".to_string();
    }
    match fs::remove_file(&path) {
        Ok(_) => "Success".to_string(),
        Err(e) => format!("Error: {}", e),
    }
}