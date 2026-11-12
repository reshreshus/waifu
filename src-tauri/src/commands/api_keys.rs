use keyring::Entry;

const SERVICE: &str = "waifu";

#[tauri::command]
pub fn save_api_key(provider: String, key: String) -> Result<(), String> {
    let entry = Entry::new(SERVICE, &provider).map_err(|e| e.to_string())?;

    entry.set_password(&key).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_api_key(provider: String) -> Result<Option<String>, String> {
    let entry = Entry::new(SERVICE, &provider).map_err(|e| e.to_string())?;

    match entry.get_password() {
        Ok(key) => Ok(Some(key)),
        Err(keyring::Error::NoEntry) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn delete_api_key(provider: String) -> Result<(), String> {
    let entry = Entry::new(SERVICE, &provider).map_err(|e| e.to_string())?;

    match entry.delete_credential() {
        Ok(()) | Err(keyring::Error::NoEntry) => Ok(()),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn has_api_key(provider: String) -> Result<bool, String> {
    let entry = Entry::new(SERVICE, &provider).map_err(|e| e.to_string())?;

    match entry.get_password() {
        Ok(_) => Ok(true),
        Err(keyring::Error::NoEntry) => Ok(false),
        Err(e) => Err(e.to_string()),
    }
}
