use gtk::prelude::*;
use relm4::prelude::*;

pub struct CheckButtonChecked;

#[relm4::component(pub)]
impl SimpleComponent for CheckButtonChecked {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::CheckButton {
            set_label: Some("Checkbox"),
            set_active: true,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
