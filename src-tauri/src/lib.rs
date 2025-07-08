use std::fs;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_settings(app_handle: tauri::AppHandle) -> Result<String, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;

    let settings_path = app_data_dir.join("settings.json");

    match fs::read_to_string(settings_path) {
        Ok(content) => Ok(content),
        Err(_) => Err("Settings file not found".to_string()),
    }
}

#[tauri::command]
fn save_settings(app_handle: tauri::AppHandle, settings: String) -> Result<(), String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;

    // Create the directory if it doesn't exist
    fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("Failed to create app data dir: {}", e))?;

    let settings_path = app_data_dir.join("settings.json");

    fs::write(settings_path, settings).map_err(|e| format!("Failed to write settings: {}", e))?;

    Ok(())
}

#[tauri::command]
fn set_always_on_top(app_handle: tauri::AppHandle, always_on_top: bool) -> Result<(), String> {
    let window = app_handle
        .get_webview_window("main")
        .ok_or("Failed to get main window")?;

    window
        .set_always_on_top(always_on_top)
        .map_err(|e| format!("Failed to set always on top: {}", e))?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_settings,
            save_settings,
            set_always_on_top
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
