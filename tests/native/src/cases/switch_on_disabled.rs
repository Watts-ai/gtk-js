use gtk::prelude::*;
use relm4::prelude::*;

pub struct SwitchOnDisabled;

#[relm4::component(pub)]
impl SimpleComponent for SwitchOnDisabled {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::Switch {
            set_active: true,
            set_state: true,
            set_sensitive: false,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
