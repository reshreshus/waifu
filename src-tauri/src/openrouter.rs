use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::commands::api_keys::get_api_key;

#[derive(Debug, Serialize, Deserialize)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Serialize)]
struct OpenRouterRequest {
    model: String,
    messages: Vec<ChatMessage>,
    max_tokens: u32,
}

#[tauri::command]
pub async fn openrouter_chat(model: String, messages: Vec<ChatMessage>) -> Result<String, String> {
    let client = Client::new();

    let key = get_api_key("openrouter".to_string())?.ok_or("No OpenRouter key")?;

    let response = client
        .post("https://openrouter.ai/api/v1/chat/completions")
        .bearer_auth(key)
        .header("Content-Type", "application/json")
        .json(&OpenRouterRequest {
            model,
            messages,
            max_tokens: 512,
        })
        .send()
        .await
        .map_err(|e| format!("Request failed: {e}"))?;

    let status = response.status();

    let body: Value = response
        .json()
        .await
        .map_err(|e| format!("Request failed: {e}"))?;

    if !status.is_success() {
        let message = body["error"]["message"]
            .as_str()
            .unwrap_or("OpenRouter request failed");

        return Err(message.to_string());
    }

    body["choices"][0]["message"]["content"]
        .as_str()
        .map(str::to_owned)
        .ok_or_else(|| "No response content returned".to_string())
}
