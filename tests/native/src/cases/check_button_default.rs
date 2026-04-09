use gtk::prelude::*;
use relm4::prelude::*;

pub struct CheckButtonDefault;

#[relm4::component(pub)]
impl SimpleComponent for CheckButtonDefault {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::CheckButton {
            set_label: Some("Checkbox"),
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
