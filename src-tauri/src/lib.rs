// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod commands;
mod openrouter;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            openrouter::openrouter_chat,
            commands::api_keys::save_api_key,
            commands::api_keys::get_api_key,
            commands::api_keys::delete_api_key,
            commands::api_keys::has_api_key,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
