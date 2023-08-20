// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::{thread, time};
use std::sync::{Arc, Mutex};
use std::sync::atomic::{AtomicBool, AtomicU16, Ordering};
use std::time::{Duration, Instant};
use enigo::{Enigo, MouseButton, MouseControllable};
use inputbot::handle_input_events;
use inputbot::KeybdKey::F6Key;
use rand::{Rng, thread_rng};
use tauri::State;
use winapi::shared::minwindef::DWORD;
use winapi::um::winuser::{INPUT, INPUT_MOUSE, INPUT_u, MOUSEEVENTF_LEFTDOWN, MOUSEEVENTF_LEFTUP, MOUSEEVENTF_MIDDLEDOWN, MOUSEEVENTF_MIDDLEUP, MOUSEEVENTF_RIGHTDOWN, MOUSEEVENTF_RIGHTUP, MOUSEINPUT, SendInput};

struct SharedState {
    cps: u16,
    delay_removed: bool,
    cps_range: u16,
    mouse_settings: MouseSettings
}

struct MouseSettings {
    mouse_down: DWORD,
    mouse_up: DWORD
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn cps(number: String, state: State<Arc<Mutex<SharedState>>>) -> String {
    match number.parse::<u16>() {
        Ok(n) => {
            state.lock().unwrap().cps = n;
        }
        Err(e) => {
            return "".to_string();
        }
    }
    number
}

#[tauri::command]
fn cps_range(number: String, state: State<Arc<Mutex<SharedState>>>) -> String {
    match number.parse::<u16>() {
        Ok(n) => {
            state.lock().unwrap().cps_range = n;
        }
        Err(e) => {
            return "".to_string();
        }
    }
    number
}

#[tauri::command]
fn delay_removed(removed: bool, state: State<Arc<Mutex<SharedState>>>) -> bool {
    state.lock().unwrap().delay_removed = removed;
    removed
}

#[tauri::command]
fn mouse_button(number: u8, state: State<Arc<Mutex<SharedState>>>) -> u8 {
    state.lock().unwrap().mouse_settings = match number {
        1 => MouseSettings {
            mouse_down: MOUSEEVENTF_MIDDLEDOWN,
            mouse_up: MOUSEEVENTF_MIDDLEUP,
        },
        2 => MouseSettings {
            mouse_down: MOUSEEVENTF_RIGHTDOWN,
            mouse_up: MOUSEEVENTF_RIGHTUP
        },
        _ => MouseSettings {
            mouse_down: MOUSEEVENTF_LEFTDOWN,
            mouse_up: MOUSEEVENTF_LEFTUP,
        }
    };
    number
}


fn main() {
    let state = Arc::new(Mutex::new(SharedState {
        cps: 16,
        delay_removed: false,
        cps_range: 3,
        mouse_settings: MouseSettings {
            mouse_down: MOUSEEVENTF_LEFTDOWN,
            mouse_up: MOUSEEVENTF_LEFTUP,
        }
    }));

    let state_clone = Arc::clone(&state);

    thread::spawn(move || {
        auto_clicker_services(state_clone)
    });

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![cps, delay_removed, mouse_button, cps_range])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn auto_clicker_services(state: Arc<Mutex<SharedState>>) {
    let clicker_is_active = Arc::new(AtomicBool::new(false));
    // Provides shared ownership of a value of AtomicBool, a boolean type which can be shared safely between threads.
    let clicker_is_active_clone = Arc::clone(&clicker_is_active);
    // Cloning clicker_is_active for the thread which will click on the screen
    F6Key.bind(move || {
        // Inverting the clicker_is_active for each press of the F6 key (F6 is our hotkey)
        clicker_is_active.store(!clicker_is_active.load(Ordering::Relaxed), Ordering::Relaxed);
    });

    thread::spawn(move || {
        handle_input_events(); // Start listening for keyboard events
    });

    loop {
        let conf = state.lock().unwrap();
        let start_time = Instant::now();
        if clicker_is_active_clone.load(Ordering::Relaxed) {
            click(true, &conf.mouse_settings);
            click(false, &conf.mouse_settings);
            if !conf.delay_removed {
                let mut real_cps = conf.cps as i32 - thread_rng().gen_range(1..conf.cps_range) as i32;
                if real_cps <= 0 {
                    real_cps = 1;
                }
                spin_sleep::sleep(Duration::from_millis((1000 / real_cps) as u64));
            }
            let elapsed_time = start_time.elapsed();
            let elapsed_ms = elapsed_time.as_secs_f64() * 1000.0;
            println!("Время выполнения: {:.2} мс", elapsed_ms);
        }
    }
}

fn click(is_down: bool, mouse_settings: &MouseSettings) {
    let mut input_u: INPUT_u = unsafe { std::mem::zeroed() };
    unsafe {
        *input_u.mi_mut() = MOUSEINPUT {
            dx: 0,
            dy: 0,
            dwExtraInfo: 0,
            mouseData: 0,
            time: 0,
            dwFlags: match is_down {
                true => {mouse_settings.mouse_down}
                false => {mouse_settings.mouse_up}
            }
        }
    }

    let mut input = INPUT {
        type_: INPUT_MOUSE,
        u: input_u
    };
    let ipsize = std::mem::size_of::<INPUT>() as i32;
    unsafe {
        SendInput(1, &mut input, ipsize);
    };
}