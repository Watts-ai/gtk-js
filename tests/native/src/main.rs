mod cases;
mod extract;

use std::path::PathBuf;

use clap::{Parser, Subcommand};
use relm4::adw;
use relm4::adw::prelude::*;
use relm4::gtk;
use relm4::prelude::*;

#[derive(Parser)]
#[command(name = "gtk-js-test")]
#[command(about = "Render GTK widgets and extract structural properties as JSON")]
struct Cli {
    #[command(subcommand)]
    command: Command,

    /// Write JSON output to this file instead of stdout
    #[arg(long)]
    output: Option<PathBuf>,
}

#[derive(Subcommand)]
enum Command {
    ButtonTextDefault,
    ButtonTextFlat,
    ButtonTextSuggested,
    ButtonTextDestructive,
    ButtonIcon,
    ButtonCircular,
    ButtonPill,
    ButtonDisabled,
    LinkDefault,
    LinkVisited,
    MenuButtonTextDefault,
    MenuButtonIcon,
    MenuButtonFlat,
    MenuButtonCircular,
    MenuButtonDisabled,
    ToggleTextDefault,
    ToggleTextChecked,
    ToggleTextFlat,
    ToggleDisabled,
    PopoverDefault,
}

/// Like [`render_and_extract`] but snapshots and extracts from the widget's first child
/// rather than the root widget itself.
///
/// Use this for container widgets (e.g. GtkMenuButton) whose visual rendering is entirely
/// delegated to a single child widget. The harness walks all render nodes including children,
/// so reading properties from the container's CSS context (padding=0) while visual properties
/// (background, border-radius, font-weight) come from the child's render nodes produces
/// inconsistent results. Snapshotting the child directly gives a clean, uniform comparison.
fn render_and_extract_inner<C>(init: C::Init, output: Option<PathBuf>)
where
    C: SimpleComponent,
    C::Root: IsA<gtk::Widget>,
    C::Init: Copy,
{
    // Set environment before GTK init for deterministic rendering
    unsafe {
        std::env::set_var("GDK_SCALE", "1");
    }

    let app = adw::Application::builder()
        .application_id("org.gtkjs.test")
        .build();

    app.connect_activate(move |app| {
        let output = output.clone();
        let settings = gtk::Settings::default().expect("Failed to get GtkSettings");
        settings.set_gtk_font_name(Some("Cantarell 11"));
        // Force Adwaita style manager to light mode
        let style_manager = adw::StyleManager::default();
        style_manager.set_color_scheme(adw::ColorScheme::ForceLight);

        let window = adw::Window::builder()
            .application(app)
            .decorated(false)
            .default_width(200)
            .default_height(100)
            .build();

        let component = C::builder().launch(init).detach();

        let widget = component.widget().clone();
        window.set_content(Some(&widget));
        window.present();

        gtk::glib::idle_add_local_once(move || {
            let inner = widget
                .first_child()
                .expect("render_and_extract_inner: widget has no first child");

            let inner_width = inner.width();
            let inner_height = inner.height();

            if inner_width <= 0 || inner_height <= 0 {
                eprintln!("Inner widget has zero size, layout may not have completed");
                std::process::exit(1);
            }

            let paintable = gtk::WidgetPaintable::new(Some(&inner));
            let snapshot = gtk::Snapshot::new();
            paintable.snapshot(&snapshot, inner_width as f64, inner_height as f64);

            if let Some(node) = snapshot.to_node() {
                let result = extract::extract_with_widget(&node, &inner);
                let json =
                    serde_json::to_string_pretty(&result).expect("Failed to serialize snapshot");
                if let Some(ref path) = output {
                    std::fs::write(path, &json).expect("Failed to write output file");
                } else {
                    println!("{json}");
                }
            } else {
                eprintln!("No render node produced");
                std::process::exit(1);
            }

            window.close();
            std::process::exit(0);
        });
    });

    app.run_with_args::<&str>(&[]);
}

/// Render a GtkPopover and extract structural properties from its `contents` child widget.
///
/// GtkPopover is a GtkNative widget with its own GDK popup surface. This helper:
/// 1. Creates a window with an anchor box as content.
/// 2. Sets the popover's parent to the anchor box.
/// 3. After the window is presented (first idle), calls `popup()` to show the popover.
/// 4. After a short delay to let the popup surface render, snapshots the `contents_widget`
///    (the first child of the GtkPopover, which carries all the visible CSS properties).
fn render_and_extract_popover_contents<C>(init: C::Init, output: Option<PathBuf>)
where
    C: SimpleComponent,
    C::Root: IsA<gtk::Popover>,
    C::Init: Copy,
{
    // Set environment before GTK init for deterministic rendering
    unsafe {
        std::env::set_var("GDK_SCALE", "1");
    }

    let app = adw::Application::builder()
        .application_id("org.gtkjs.test")
        .build();

    app.connect_activate(move |app| {
        let output = output.clone();
        let settings = gtk::Settings::default().expect("Failed to get GtkSettings");
        settings.set_gtk_font_name(Some("Cantarell 11"));
        // Force Adwaita style manager to light mode
        let style_manager = adw::StyleManager::default();
        style_manager.set_color_scheme(adw::ColorScheme::ForceLight);

        // Create an anchor widget — GtkPopover needs a parent widget in the window tree
        let anchor = gtk::Box::builder()
            .orientation(gtk::Orientation::Horizontal)
            .halign(gtk::Align::Center)
            .valign(gtk::Align::Center)
            .width_request(100)
            .height_request(50)
            .build();

        let window = adw::Window::builder()
            .application(app)
            .decorated(false)
            .default_width(400)
            .default_height(400)
            .build();

        window.set_content(Some(&anchor));

        let component = C::builder().launch(init).detach();
        let popover = component.widget().clone();
        // Parent the popover to the anchor box (standard GTK popover usage)
        popover.upcast_ref::<gtk::Popover>().set_parent(&anchor);

        window.present();

        let window_clone = window.clone();
        let popover_clone = popover.clone();
        let output_clone = output.clone();

        // First idle: anchor is now realized/mapped — call popup() to show the popover
        gtk::glib::idle_add_local_once(move || {
            popover_clone.upcast_ref::<gtk::Popover>().popup();

            let window_inner = window_clone;
            let popover_inner = popover_clone;
            let output_inner = output_clone;

            // Use a short timeout to let the popup surface fully render before snapshotting.
            // GtkPopover creates a separate GDK surface on popup(), and layout/rendering
            // happens asynchronously — a single idle callback is not enough.
            gtk::glib::timeout_add_local_once(
                std::time::Duration::from_millis(50),
                move || {
                    let widget = popover_inner.upcast_ref::<gtk::Popover>();
                    let inner = widget
                        .first_child()
                        .expect("render_and_extract_popover_contents: popover has no first child");

                    let inner_width = inner.width();
                    let inner_height = inner.height();

                    if inner_width <= 0 || inner_height <= 0 {
                        eprintln!(
                            "Popover contents widget has zero size, layout may not have completed"
                        );
                        std::process::exit(1);
                    }

                    let paintable = gtk::WidgetPaintable::new(Some(&inner));
                    let snapshot = gtk::Snapshot::new();
                    paintable.snapshot(&snapshot, inner_width as f64, inner_height as f64);

                    if let Some(node) = snapshot.to_node() {
                        let result = extract::extract_with_widget(&node, &inner);
                        let json = serde_json::to_string_pretty(&result)
                            .expect("Failed to serialize snapshot");
                        if let Some(ref path) = output_inner {
                            std::fs::write(path, &json).expect("Failed to write output file");
                        } else {
                            println!("{json}");
                        }
                    } else {
                        eprintln!("No render node produced");
                        std::process::exit(1);
                    }

                    window_inner.close();
                    std::process::exit(0);
                },
            );
        });
    });

    app.run_with_args::<&str>(&[]);
}

fn render_and_extract<C>(init: C::Init, output: Option<PathBuf>)
where
    C: SimpleComponent,
    C::Root: IsA<gtk::Widget>,
    C::Init: Copy,
{
    // Set environment before GTK init for deterministic rendering
    unsafe {
        std::env::set_var("GDK_SCALE", "1");
    }

    let app = adw::Application::builder()
        .application_id("org.gtkjs.test")
        .build();

    app.connect_activate(move |app| {
        let output = output.clone();
        let settings = gtk::Settings::default().expect("Failed to get GtkSettings");
        settings.set_gtk_font_name(Some("Cantarell 11"));
        // Force Adwaita style manager to light mode
        let style_manager = adw::StyleManager::default();
        style_manager.set_color_scheme(adw::ColorScheme::ForceLight);

        let window = adw::Window::builder()
            .application(app)
            .decorated(false)
            .default_width(200)
            .default_height(100)
            .build();

        let component = C::builder().launch(init).detach();

        let widget = component.widget().clone();
        window.set_content(Some(&widget));
        window.present();

        gtk::glib::idle_add_local_once(move || {
            let widget_width = widget.width();
            let widget_height = widget.height();

            if widget_width <= 0 || widget_height <= 0 {
                eprintln!("Widget has zero size, layout may not have completed");
                std::process::exit(1);
            }

            // Snapshot the widget at its natural size
            let paintable = gtk::WidgetPaintable::new(Some(&widget));
            let snapshot = gtk::Snapshot::new();
            paintable.snapshot(&snapshot, widget_width as f64, widget_height as f64);

            if let Some(node) = snapshot.to_node() {
                let result = extract::extract_with_widget(&node, &widget);
                let json =
                    serde_json::to_string_pretty(&result).expect("Failed to serialize snapshot");
                if let Some(ref path) = output {
                    std::fs::write(path, &json).expect("Failed to write output file");
                } else {
                    println!("{json}");
                }
            } else {
                eprintln!("No render node produced");
                std::process::exit(1);
            }

            window.close();
            std::process::exit(0);
        });
    });

    app.run_with_args::<&str>(&[]);
}

fn main() {
    let cli = Cli::parse();
    let output = cli.output;

    match cli.command {
        Command::ButtonTextDefault => {
            render_and_extract::<cases::button_text_default::ButtonTextDefault>((), output)
        }
        Command::ButtonTextFlat => {
            render_and_extract::<cases::button_text_flat::ButtonTextFlat>((), output)
        }
        Command::ButtonTextSuggested => {
            render_and_extract::<cases::button_text_suggested::ButtonTextSuggested>((), output)
        }
        Command::ButtonTextDestructive => {
            render_and_extract::<cases::button_text_destructive::ButtonTextDestructive>((), output)
        }
        Command::ButtonIcon => render_and_extract::<cases::button_icon::ButtonIcon>((), output),
        Command::ButtonCircular => {
            render_and_extract::<cases::button_circular::ButtonCircular>((), output)
        }
        Command::ButtonPill => render_and_extract::<cases::button_pill::ButtonPill>((), output),
        Command::ButtonDisabled => {
            render_and_extract::<cases::button_disabled::ButtonDisabled>((), output)
        }
        Command::LinkDefault => render_and_extract::<cases::link_default::LinkDefault>((), output),
        Command::LinkVisited => render_and_extract::<cases::link_visited::LinkVisited>((), output),
        Command::MenuButtonTextDefault => {
            render_and_extract_inner::<cases::menu_button_text_default::MenuButtonTextDefault>(
                (), output,
            )
        }
        Command::MenuButtonIcon => {
            render_and_extract_inner::<cases::menu_button_icon::MenuButtonIcon>((), output)
        }
        Command::MenuButtonFlat => {
            render_and_extract_inner::<cases::menu_button_flat::MenuButtonFlat>((), output)
        }
        Command::MenuButtonCircular => {
            render_and_extract_inner::<cases::menu_button_circular::MenuButtonCircular>((), output)
        }
        Command::MenuButtonDisabled => {
            render_and_extract_inner::<cases::menu_button_disabled::MenuButtonDisabled>((), output)
        }
        Command::ToggleTextDefault => {
            render_and_extract::<cases::toggle_text_default::ToggleTextDefault>((), output)
        }
        Command::ToggleTextChecked => {
            render_and_extract::<cases::toggle_text_checked::ToggleTextChecked>((), output)
        }
        Command::ToggleTextFlat => {
            render_and_extract::<cases::toggle_text_flat::ToggleTextFlat>((), output)
        }
        Command::ToggleDisabled => {
            render_and_extract::<cases::toggle_disabled::ToggleDisabled>((), output)
        }
        Command::PopoverDefault => {
            render_and_extract_popover_contents::<cases::popover_default::PopoverDefault>(
                (), output,
            )
        }
    }
}
