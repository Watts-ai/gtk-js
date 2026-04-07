use gtk::prelude::*;
use relm4::adw;
use relm4::prelude::*;

pub struct HeaderBarFlat;

#[relm4::component(pub)]
impl SimpleComponent for HeaderBarFlat {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::HeaderBar {
            set_show_title_buttons: false,
            add_css_class: "flat",
            set_title_widget: Some(&adw::WindowTitle::new("Title", "")),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
