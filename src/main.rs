// --- GHOST-LINK CORE: RUST SYSTEMS ENGINE ---
// [2026-01-16] Unified Engine: Serves API and Static Assets.
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
    // 1. Build the Router with Industrial Precision
    let app = Router::new()
        // API Endpoints: Logic for the bridge
        .route("/vitals", get(get_vitals))
        .route("/read/:filename", get(read_file))
        .route("/save/:filename", post(save_file))
        
        // Static File Service: Replaces the Python server
        // This serves everything in src/static (HTML, CSS, and the /dist folder)
        .fallback_service(ServeDir::new("src/static"))
        
        // Middleware: Allow browser-to-binary communication
        .layer(CorsLayer::permissive());

    // 2. Configure the Ignition Address
    let addr = SocketAddr::from(([127, 0, 0, 1], 8000));
    println!("GHOST-LINK CORE: Engine Ignition at http://{}", addr);

    // 3. Start the persistent async loop
    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// HANDLER: System Hardware Stats
// Pulls real-time data from the Arch Linux kernel.
async fn get_vitals() -> Json<Value> {
    let mut sys = System::new_all();
    sys.refresh_all();
    
    let cpu = sys.global_cpu_usage();
    let ram_pct = (sys.used_memory() as f64 / sys.total_memory() as f64) * 100.0;
    
    Json(json!({
        "cpu": format!("{:.1}%", cpu),
        "ram": format!("{:.1}%", ram_pct),
        "uptime": format!("{}s", System::uptime())
    }))
}

// HANDLER: Read File from Disk
// Accesses the source files inside the static directory.
async fn read_file(Path(filename): Path<String>) -> String {
    let path = format!("src/static/{}", filename);
    fs::read_to_string(&path).unwrap_or_else(|_| format!("Error: {} not found", path))
}

// HANDLER: Save File to Disk
// Writes code updates back to the static directory.
async fn save_file(Path(filename): Path<String>, body: String) -> String {
    let path = format!("src/static/{}", filename);
    match fs::write(&path, body) {
        Ok(_) => "Success".to_string(),
        Err(e) => format!("Error: {}", e),
    }
}