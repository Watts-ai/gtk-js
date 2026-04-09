use gtk::prelude::*;
use relm4::prelude::*;

pub struct CheckButtonCheckedDisabled;

#[relm4::component(pub)]
impl SimpleComponent for CheckButtonCheckedDisabled {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::CheckButton {
            set_label: Some("Checkbox"),
            set_active: true,
            set_sensitive: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
